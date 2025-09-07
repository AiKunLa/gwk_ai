class EventEmitter {
  constructor() {
    this.events = {};
  }

  //注册监听器（on）、发射事件（emit）、移除监听器（off）和一次性监听器（once）。
  on(event, listener) {
    // 若没有该事件则创建
    if (!this.events[event]) {
      this.events[event] = [];
    }
    // 将listener 放入事件对应的空间中
    this.events[event].push(listener);
  }

  //手动促发
  emitter(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => {
      listener.apply(this, args);
    });
  }

  off(event, listener) {
    // 移除事件  removeEventlister type + callback 具体订阅者
    if (!this.events[event]) {
      return;
    }
    // 移除
    this.events[event] = this.events[event].filters((l) => l !== listener);
  }

  // 只触发一次
  once() {}
}

const ws = new EventEmitter();
ws.on("offer", () => {
  console.log("go go go");
});

ws.emitter("offer");
setTimeout(() => {
  ws.emitter("offer");
}, 1000);
