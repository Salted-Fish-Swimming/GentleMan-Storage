const fs = require('fs/promises');
const path = require('path');
const { createHash } = require('crypto');

function hash(digest) {
  const h = createHash('sha256');
  h.read(digest);
  const hashstr = h.digest('hex');
  return hashstr;
  // const nchars = '0123456789'.split('');
  // return hashstr.split('').filter(s => nchars.some(n => n === s)).join('');
}

const dbConfiger = require('../data-manager')
const StorageConfiger = require('../storage-manager');

// 加载数据库
const manhuaDB = dbConfiger('./data-base')('manhua');   // 漫画信息
const errorDB = dbConfiger('./data-base/downloader')('error');    // 下载错误信息
const downloaderDB = dbConfiger('./data-base/downloader')('info');  // 下载器信息
// 加载资源存储管理器
const StorageManager = StorageConfiger('./storage');

// 因为错误信息要频繁的和前端交互, 所以此处就较少使用 try-throw 的方式来处理错误

// downloaderPath 下载器存储路径
module.exports = function (downloaderPath) {
  let _modules = null;

  const loadModules = async () => {
    // 默认创建文件夹
    await fs.mkdir(downloaderPath, { recursive: true });
    // 获取下载器文件名
    const dlnames = await fs.readdir(downloaderPath);
    const modules = dlnames.map((filename) => require(path.resolve('.', downloaderPath, filename)));
    return modules;
  }

  return {
    async modules () {
      if (!_modules) {
        _modules = await loadModules();
      }
      return _modules;
    },
    async addDownloader (url, client) {
      ;
    },
    async download (url, client) {
      const allowModules = (await this.modules()).filter(m => m.allowURL(url));
      if (allowModules.length == 0) {
        return {
          type: 'error',
          msg: '没有模块可以解析这个地址',
        };
      }
      const downloader = allowModules[0];
      const mid = hash(url);
      // db 是lazy的, 即只有donwload执行完毕或异常中断，才会保存相应信息
      let data = null;
      const db = {
        save (_data) { data = _data; },
      }
      const storage = StorageManager(mid);
      const result = await downloader.download(mid, url, db, storage, client);
      if (result.type = 'error') { // 下载出错
        errorDB.insert({
          downloader: {
            id: downloader.id
          },
          info: result.info
        });
      }
      return result;
    },
    async redownload (errorinfo, client) {
      ;
    },
  };
}