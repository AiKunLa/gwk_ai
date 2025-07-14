// 第一轮宏任务 1
console.log("Start");

//微任务 2
// process 会在node同步代码执行之后执行
process.nextTick(() => {
  console.log("Process next tick");
});

// 微任务 3
Promise.resolve().then(() => {
  console.log("Promise resolve");
});

setTimeout(() => {
  // 新一轮宏任务 4
  console.log("setTimeout");
  process.nextTick(() => {
    // 最后执行 5
    console.log("Process next tick in setTimeout");
  });
}, 0);

console.log("End");

// Start
// End
// Process next tick
// Promise resolve
// setTimeout
