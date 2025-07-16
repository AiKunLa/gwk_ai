function StorageBase() {}
StorageBase.prototype.get = function (key) {
  return localStorage.getItem(key);
};
StorageBase.prototype.set = function (key, value) {
  localStorage.setItem(key, value);
};

const Storage = (function () {
  let instance = null;
  return function () {
    if (!instance) {
      instance = new StorageBase();
    }
    return instance;
  };
})();
const storage = new Storage();
const storage2 = new Storage();
console.log(storage === storage2);
