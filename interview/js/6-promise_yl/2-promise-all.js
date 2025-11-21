function myPromiseAll(promises) {
  return new Promise((resolve, rejected) => {
    if (!Array.isArray(promises)) {
      return rejected(new Promise("myPromiseAll must receive an array"));
    }

    const totalCount = promises.length;

    // 存储结果
    const result = [];
    // 完成的promise数量
    let resolveCount = 0;

    if (totalCount === 0) {
      return resolve([]);
    }

    promises.forEach((promises, index) => {
      Promise.resolve(promises)
        .then((value) => {
          result[index] = value;
          resolveCount++;
          if (resolveCount === totalCount) resolve(result);
        })
        .catch((reason) => rejected(reason));
    });
  });
}

function myPromiseAll2(promises) {
  return new Promise((resolve, rejected) => {
    if (!Array.isArray(promises)) {
      return rejected(new TypeError("Promiseall must recieve Array"));
    }

    const totalCount = promises.length;
    const result = [];
    let resolveCount = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          result[index] = value;
          resolveCount++;
          if (resolveCount === totalCount) {
            return resolve(result);
          }
        })
        .catch((resason) => rejected(resason));
    });
  });
}
