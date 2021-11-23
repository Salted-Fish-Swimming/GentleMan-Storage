const path = require('path');
const Koa = require('koa');
const static = require('koa-static');
const websockify = require('koa-websocket');
const uuid = require('uuid/v4');
const bodyparser = require('koa-bodyparser');

const router = require('./router');
const session = require('./session');

const app = websockify(new Koa());
// const app = new Koa();

// 启用静态资源
app.use(static(path.join(__dirname, 'static')));

// 使用session
app.use(session(app));

// 启用 bodyparser 解析上传数据
app.use(bodyparser());

// 启用 websocket
app.ws.use(async (ctx, next) => {
  const { websocket } = ctx;
  const initData = {
    id: uuid(),
  };
  websocket.send(JSON.stringify(initData));
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log(`server start at 'http://127.0.0.1:3000'`);
});

module.exports = () => {};
