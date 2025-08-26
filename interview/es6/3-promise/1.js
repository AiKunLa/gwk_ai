const p1 = Promise.resolve("p1");
const p2 = new Promise((resolve, reject) => {
  // 执行器本身不是异步的 then是异步的
  setTimeout(() => {
    resolve("p2 resolve");
  }, 1000);
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p3 resolve");
  }, 2000);
});

// 创建后立即拒绝，同步
const p4 = Promise.reject("p4 rejected");

// 异步
const p5 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('p5 reject')
  }, 1500);
});

