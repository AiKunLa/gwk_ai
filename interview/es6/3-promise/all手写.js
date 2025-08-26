const { error } = require("echarts/types/src/util/log.js");

Promise.myAll = function (promises) {
  let arr = []; // 结果数组
  let completedCount = 0;
  return new Promise((resolve, reject) => {
    // 当所有的promse都resolve 才能调用resolve
    // 若干promises 中有不是promise的对象 那么 使用Promise.resolve()

    promises.forEach((item, i) => {
      // 为了容错
      Promise.resolve(item)
        .then((res) => {
          arr[i] = res;
          completedCount++;
          if (completedCount === promises.length) {
            resolve(arr); // 改变当前padding 为fuled
          }
        })
        .catch((error) => {
          reject(error); // 改变当前 padding 为rejected
        });
    });
  });
};
