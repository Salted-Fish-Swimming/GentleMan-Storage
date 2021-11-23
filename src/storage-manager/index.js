const fs = require('fs/promises');
const path = require('path');

const StorageManagerCache = new WeakMap();

module.exports = function (storagePath) {
  storagePath = path.resolve(storagePath);
  if (!StorageManagerCache.has(storagePath))
    StorageManagerCache.set(storagePath, new Map());
  const cache = StorageManagerCache.get(storagePath);

  return {
    new (id) {
      const fullpath = path.resolve('.', storagePath.toString(), id.toString());
      if (!cache.has(fullpath))
        cache.set(fullpath, new Storage(fullpath));
      return cache.get(fullpath);
    },
    delete (storage) {
      storage.deleteSelf();
    },
    list () {
      const result = new Array();
      for (const value of cache.values()) {
        result.push(value);
      }
      return result;
    },
    deleteAll () {
      cache.forEach((value, key) => {
        const storage = value;
        storage.deleteSelf();
        cache.delete(key);
      });
    }
  }
}

class Storage {

  constructor (storagePath) {
    this.path = storagePath;
    this.deleted = false;
  }

  async load () {
    if (!this.loaded) {
      await fs.mkdir(this.path, { recursive: true });
      this.loaded = true;
    }
  }

  async save (filename, content) {
    await this.load();
    const fullpath = path.resolve(this.path, filename);
    await fs.writeFile(fullpath, content);
  }

  async read (name) {
    await this.load();
    const content = await fs.readFile(path.resolve(this.path, name));
    return content;
  }

  async list () {
    await this.load();
    return await fs.readdir(this.path);
  }

  async delete (name) {
    await this.load();
    await fs.rm(path.resolve(this.path, name));
  }

  async deleteAll () {
    await this.load();
    (await this.list()).forEach(async name => await this.delete(name));
  }

  async deleteSelf () {
    await this.load();
    await fs.rm(this.path, { recursive: true });
    this.deleted = true;
  }
}