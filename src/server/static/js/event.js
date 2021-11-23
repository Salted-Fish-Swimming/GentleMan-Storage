class Event {

  constructor () {
    this.events = new Object();
  }

  on (type, fn) {
    if (!this.events[type]) {
      this.events[type] = Array();
    }
    if (fn instanceof Function)
      this.events[type].push(fn);
  }

  off (type, callback) {
    if (this.events[type]) {
      let callbacks = this.events;
      callbacks.splice(callbacks.indexOf(callback));
    }
  }

  emit (type) {
    let callbacks = this.events[type] || Array();
    for (let callback of callbacks) {
      callback()
    }
  }

}

class EventHandler {
  
  constructor (event, fn) {
    this.event = event;
    this.fn = fn;
  }

}

function delay (timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  })
}