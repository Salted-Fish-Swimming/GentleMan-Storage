const path = require('path');
const fs = require('fs/promises');

/**
 * 在nodejs里，包只会被导入一次，不需要使用全局变量,
 * 来确保缓存的唯一性
 */
const dbManagerCache = new WeakMap();

// 传入数据存储路径
module.exports = function (dataPath) {
  dataPath = path.resolve(dataPath);
  if (!dbManagerCache.has(dataPath)) {
    dbManagerCache.set(dataPath, new Map());
  }
  const cache = dbManagerCache.get(dataPath);

  return function (dbName) {
    // 格式化文件名
    const dbFileName = path.format({
      name: path.parse(dbName).name,
      ext: '.json',
    });
    const dbPath = path.resolve(dataPath, dbFileName);
    // 检测缓存
    if (!cache.has(dbPath)) {  // 缓存未命中
      cache[dbPath] = new DataBase(dataPath, dbFileName);
    }
    return cache[dbPath];
  }
}

function patchTerm (query, term) {
  for (const key in query) {
    switch (typeof query[key]) {
      case 'object':
        if (term[key] === undefined) return false;
        if (!patchTerm(query[key], term[key])) return false;
        break;
      case 'string':
      case 'number':
      case 'boolean':
        if (query[key] !== term[key]) return false;
        break;
      default:
    }
  }
  return true;
}

/**
 * 异步数据库
 */
class DataBase {

  constructor (dataPath, dbName) {
    this.dataPath = dataPath;
    this.dbName = dbName;
    this.dbPath = path.resolve('.', this.dataPath, dbName);
  }

  // 加载内容
  async doLoad () {
    // 递归的创建文件夹, 默认创建不覆盖
    await fs.mkdir(this.dataPath, { recursive: true });

    try {   // 文件存在创建数据库对象
      const fileContent = (await fs.readFile(this.dbPath)).toString() || '[]';
      this.data = DataBase.str2json(fileContent);
    } catch (error) { // 数据库不存在, 创建新数据库
      if (error.code === 'ENOENT') {  // 文件不存在
        this.data = [];
        await fs.writeFile(this.dbPath, DataBase.json2str(this.data));
      } else { // 文件是目录, 请不要乱动base文件夹
        throw error;
      }
    }
    this.loaded = true;
  }

  async load () {
    if (!this.loaded) {
      await this.doLoad();
    }
  }

  // 每隔十秒存一次, 减少保存次数
  toSave () {
    if (!this.lock) {
      this.lock = true;
      setTimeout(async () => {
        await this.save();
        this.lock = false;
      }, 10 * 1000);
    }
  }

  async insert (obj) {
    await this.load();
    if (Object.keys(obj).length == 0) // 不允许插入数据
      return;
    this.data.push(obj);
    this.toSave();
  }

  async search (query) {
    await this.load();
    return this.data.find((term) => patchTerm(query, term)) || null;
  }

  async searchAll (query) {
    await this.load();
    return this.data.filter(term => patchTerm(query, term));
  }

  async delete (objs) {
    await this.load();
    let index = 0;
    let result = new Array();
    for (const obj of objs) {
      index = this.data.indexOf(obj, index);
      if (index >= 0) {
        result.push(...this.data.splice(index, 1));
      }
    }
    this.toSave();
    return result;
  }

  async save () {
    await this.load();
    const writeContent = DataBase.json2str(this.data);
    await fs.writeFile(this.dbPath, writeContent, { encoding: 'utf-8' });
  }

  static json2str (json) {
    return JSON.stringify(json, null, 2);
  }

  static str2json (str) {
    return JSON.parse(str);
  }

}

const save = async () => {
  for (const dbPath in cache) {
    const db = cache[dbPath];
    await db.save();
  }
}

process.on('exit', async (code) => {
});

process.on('SIGINT', async () => {
  console.log('程序异常终止');
  for (const dbPath in cache) {
    const db = cache[dbPath];
    await db.save();
  }
  process.exit();
});