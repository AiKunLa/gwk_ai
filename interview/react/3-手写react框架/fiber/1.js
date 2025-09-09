// 全局对象 ， 指向下一个要处理的单元工作 fiber节点
// fiber对象 链表结构

// 变量用于跟踪 Fiber 树中下一个需要处理的工作单元（Fiber节点）
let nextUnitOfWork = null; 

// 在浏览器空闲的时候调用

/**
 * 函数是 Fiber 架构的核心调度器，它接收浏览器的 deadline 参数
 * 在循环中不断处理工作单元，直到没有更多工作或需要让出执行权
 * @param {*} deadline 
 */
function workLoop(deadline) {
  //
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    // 执行当前工作单元，并获取下一个待处理的工作单元
    nextUnitOfWork = performaUnitOfWork(nextUnitOfWork);
    // 若任务时间小于1ms 停止渲染，中断执行
    shouldYield = deadline.timeRemaing() < 1;
  }
}
// 这里是模拟实现，真正实现是通过 schedule 任务调度机制
// 使用 requestIdleCallback API 在浏览器主线程空闲时调用 workLoop
requestIdleCallback(workLoop);
