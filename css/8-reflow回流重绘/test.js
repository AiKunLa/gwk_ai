console.log("start ");
const p = new Promise((resolve, reject) => {
  console.log("111");
  // 异步任务
  setTimeout(() => {
    const success = true;
    console.log("222");
    if (success) {
      resolve("任务成功");
    } else {
      reject("任务失败");
    }
  }, 3000);
  console.log("333");
});

p.then((res) => {
  console.log(res);
});

console.log("end");
