const fetchUserInfo = (id) => {
  return new Promise((resolve) => {
    resolve({
      id: id,
      name: "LiSI",
      age: 12,
    });
  });
};

async function getUserInfo(id) {
  const userInfo = await fetchUserInfo(id);
  // 这里输出的 userInfo 是 fetchUserInfo 返回的 Promise resolve 的结果
  // 由于 getUserInfo 是 async 函数，返回一个 Promise
  // 如果在外面直接 console.log(getUserInfo())，看到的是 Promise，而不是 userInfo 本身
  console.log(userInfo); // 这里输出的就是最终的 userInfo 对象
  return userInfo;
}

// 这里先执行是因为 console.log(getUserInfo()) 直接调用了 getUserInfo 函数。
// 由于 getUserInfo 是一个 async 函数，调用它会立即返回一个 Promise 对象，
// 该 Promise 代表着异步操作还未完成，当异步结果（userInfo）准备好后可以通过 then、await 等方式获取。
// 直接 console.log(getUserInfo())，看到的是 Promise 对象，而不是 userInfo 本身。
console.log(getUserInfo());





