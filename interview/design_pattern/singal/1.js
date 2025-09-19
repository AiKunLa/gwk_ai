class Singal {
  static getInstance() {
    if (!Singal.instance) {
      Singal.instance = new Singal();
    }
    return this.instance;
  }

  constructor() {
    // 防止通过 new 多次实例化
    if (Singal.instance) {
      return Singal.instance;
    }
    this.url = "localhost:3306";
    this.connected = false;
    Database.instance = this;
  }
}

const Singleton = (function () {
  let instance;
  return () =>
    instance ||
    (instance = {
      name: "sd",
      timestapm: "asdfaf",
    });
})();

const example1 = Singleton();
const example2 = Singleton();
console.log(example1);
console.log(example1 === example2);
