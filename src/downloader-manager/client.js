module.exports = {};

class UserClient {

  constructor () {
    this.tasks = new Array();
  }

  newTask (id) {
    ;
  }

}

// 对于每一个用户的每一个单独的下载任务, 都会生成一个对应的实例
class DownloaderClient {

  constructor () {
    this.sendMessage = '';
    this.messageSended = false;
    this.sendType = null;
    this.process = null;
  }

  onSend (fn) {
    this.onsend = fn;
  }

  sendInfo () {
    const sendInfo = {};
    if (this.sendType === null) {
      return sendInfo;
    }
    if (this.sendType === 'message') {
      if (!this.messageSended) {
        sendInfo.message = this.sendMessage;
        this.messageSended = true;
      }
    }
    if (this.process !== null) {
      sendInfo.process = this.process;
    }
    return info;
  }

  send (info) {
    const type = info.type;
    if (type === 'error') {
      this.sendType = 'error';
      this.sendMessage = info.message;
    } else if (type === 'message') {
      this.sendType = 'message';
      this.sendMessage = info.message;
      this.messageSended = false;
    } else if (type === 'process') {
      const action = info.action;
      if (action === 'create') {
        this.process = {
          capacity: info.capacity,
          quota: 0
        };
      } else if (action === 'add') {
        this.process.quota += info.value;
      }
    } else if (type === 'end') {
      this.type = 'end';
    }
  }

}