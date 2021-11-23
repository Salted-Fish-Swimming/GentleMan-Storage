const cache = new WeakMap();

module.exports = {
  get (session) {
    return cache.get(session.wsid);
  },
  // post:/ws 的回调函数, 绑定 websocket id
  async routes () {
    return (ctx, next) =>{
      const data = ctx.request.body;
      ctx.session.wsid = data.id;
    }
  },
  // websocket 的回调函数
  async websocket () {
    return (ctx, next) => {
      const initData = { type: 'start' };
      // 尝试五次, 如果五次都找不到 id 就连接失败
      for (let i = 0; i < 5; i ++) {
        const id = uuid();
        if (cache.has(id)) {  // 对应 id 存在 websocket 连接
          initData.type = 'close';
        } else {
          initData.id = id;
          break;
        }
      }
      const ws = new WebSocket(ctx.websocket);
      cache.set(initData.id, ws); // 设置缓存
      ws.send(initData);
      await next();
    }
  }
};

class WebSocket {

  constructor (ws) {
    this.websocket = ws;
  }

  send (data) {
    this.websocket.send(JSON.stringify(data));
  }

}

/**
 * info 格式: { [key1]: info1, [key2]: info2, ...}
 */
class Multipler {

  constructor () {
    // 分离信道
    this.sendInfo = new Object();
    this.receiveTasks = new Object();
  }

  send (key, msg) {
    this.sendInfo[key] = msg;
  }

  onSend () {
    const AllInfo = this.sendInfo;
    this.sendInfo = new Object();
    return AllInfo;
  }

  receive (AllInfo) {
    for (const key in AllInfo) {
      const taskQueue = this.receiveTasks[key] || [];
      for (const fn of taskQueue) {
        fn(AllInfo[key]);
      }
    }
    this.receiveTasks = new Object();
  }

  onReceive (key, fn) {
    if (!(key in this.receiveTasks)) {
      this.receiveTasks = new Array();
    }
    this.receiveTasks[key].push(fn);
  }

}