# 进程与线程
- 进程：cpu资源分配的最小单位
- 线程：cpu调度的最小单位
- cpu调度算法
  - 时间片轮转法
  - 优先级调度法
  - 多级反馈队列调度法

## 同步与异步
- 同步：代码按照顺序执行
- 异步：代码不按照顺序执行

- 异步任务：代码的编写顺序与执行顺序不同
 - 异步任务比较花时间，


## Promise 底层理解
- promise是什么
- 为什么要有promise
 - 异步任执行需要时间，执行时会跳到下一行去执行 这样代码的执行顺序与书写顺序不一致
- const p = new Promise()
 Promise 类专门用于解决这个问题 prototype then方法
- 将异步任务放入promise中 异步任务执行完后调用resolve()
- p.then(()=>{console.log("111")}) 即可完成同步执行

## 控制执行流程的es6 
- new Promise() // 控制异步流程
- ()=>{ // executor 耗时性异步任务
    异步任务setTimeout readFile fetch
}
- resolve()后 then() 执行

- promise .then 升级到 async await 成对出现
 async用于修饰函数 表示内部有异步任务
 await 等待异步任务执行完  只能写在async函数中

