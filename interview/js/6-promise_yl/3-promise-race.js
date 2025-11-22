function myPromiseRace(promises) {
  return new Promises((resolved, rejected) => {
    // 当第一个Promise resolved则resolved ，rejected同上

    if (!Array.isArray(promises)) {
      return resolved(new TypeError("myPromiseRace must receive array"));
    }

    promises.forEach((promise) => {
      Promise.resolve(promise).then(resolved, rejected);
    });
  });
}
