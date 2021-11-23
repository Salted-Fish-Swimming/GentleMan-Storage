/**
 * 测试文件, 之后会删除
 */

const fs = require('fs/promises');
const path = require('path');

const axios = require('axios');

const dlcfg = require('./src/downloader-manager');
// const dlmg = dlcfg('./downloader');
const StorageManager = require('./src/storage-manager')('./storage');
const DBConfiger = require('./src/data-manager');
const DBManager = DBConfiger('./data-base');
const dl = require('./downloader/downloader-1');
const cheerio = require('cheerio');

function delay(timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(timeout);
      resolve(0);
    }, timeout);
  });
}

const downloadURL = 'https://zha.qqhentai.com/g/380744/';

async function test (url) {
  const id = 351786;
  const storage = StorageManager.new(id);
  const manhuaDB = DBManager('manhua');
  let data = {};
  const db = {
    save (_data) {
      data = _data;
    }
  };
  const client = {
    send (msg) {
      console.log(msg);
    }
  }
  dl.download(url, db, storage, client);
  manhuaDB.insert(data);
}

async function get(url) {
  return await axios.get(url);
}

async function post(url) {
  return await axios.post(url);
}

(async () => {
  // const $ = cheerio.load(page);
  const origin = (path) => 'http://127.0.0.1:3000/' + (path || '');
  // const wsP = post(origin('ws'));
  const aP = axios.get(origin('index.html'));
  const adata = (await aP).data;
  console.log(adata);
  // const wsData = (await wsP).data;
  // console.log(wsData);
});

async function test() {
  console.log('test start');
  await (new Promise((res, rej) => setTimeout(() => {
    res(0);
  }, 1000)));
  console.log('test end');
}

// const server = require('./src/server');

