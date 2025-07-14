console.log("第一轮宏任务开始");

console.log("第一轮同步代码执行");


// Promise 本身是同步的，它后面的then方法是异步的
const promise1 = Promise.resolve("微任务1");
const promise2 = Promise.resolve("微任务2");

const promise3 = new Promise((resolve) => {
  // console.log("promise3");
  resolve("微任务3");
});

// 这是第一轮的微任务
promise1.then((res) => {
  console.log(res);
});
promise2.then((res) => {
  console.log(res);
});
promise3.then((res) => {
  console.log(res);
});

setTimeout(() => {
  console.log("第二轮宏任务开始");
  console.log("第二轮同步代码执行");
  const promise4 = Promise.resolve("微任务4");
  promise4.then((res) => {
    console.log(res);
  });
  console.log("第二轮宏任务结束");
}, 0);
setTimeout(() => {
  console.log("第三轮宏任务开始");
}, 0);


console.log("第一轮宏任务结束");
