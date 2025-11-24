const fetchUserInfo = (id) => {
  return new Promise((resolve) => {
    resolve({
      id: id,
      name: "LiSI",
      age: 12,
    });
  });
};

function* generator() {
  const userInfo = yield fetchUserInfo("111");
  const userInfo2 = yield fetchUserInfo("222");
  console.log(userInfo);
  console.log(userInfo2);
}

function run(genFn) {
  let gf = genFn();
  function next(val) {
    const result = gf.next(val);
    if (!result.done) {
      result.value.then(next);
    }
  }
  next();
}

run(generator);
