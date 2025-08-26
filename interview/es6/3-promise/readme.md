# Promise的静态方法
Promise.all()  
Promise.race()  
Promise.any  
Promise.allSettled

Promise.all()	全成功才成功：所有 Promise 都 fulfilled 时，它才 fulfilled；任何一个 rejected，它就立即 rejected。
Promise.race()	谁快听谁的：哪个 Promise 最先完成（无论 fulfilled 或 rejected），它的结果就决定了 Promise.race() 的最终状态。
Promise.any()	首个成功即成功：只要有一个 Promise fulfilled，它就立即 fulfilled；只有当所有 Promise 都 rejected 时，它才 rejected（返回 AggregateError）。
Promise.allSettled()	全部完成才结束：等待所有 Promise 都 settled（fulfilled 或 rejected），然后返回一个包含每个 Promise 结果（含状态和值/原因）的数组。


## Promise.all()
- MDN定义
    根据MDN的定义，Promise.all方法接收一个promise的可迭代对象作为输入（Array，Map，Set都属于ES6的iterable类型），并返回一个Promise实例，输入的所有promse的resolve回调结果是一个数组，并按顺序存放。只有任何一个输入的reject回调执行，就会抛出错误，Promise.all的promise失败，catch执行，reject是第一个错误
- all中的Promise是并行执行的，执行时间是最长的
- 若有一个promise失败了，虽然其他的promise还是会执行，但是没有意义了。它会返回的第一个reject，然后我们可以用catch去捕捉
- 使用console.time()
    console.time('fetch');
    // ... 一些操作
    console.timeLog('fetch', '阶段A完成');
    // ... 其他操作
    console.timeEnd('fetch'); // fetch: 123.45 ms

- 用途 ：当需要并行执行多个异步操作，并等待所有操作都成功完成时使用。
    一个用户详情页面需要同时显示用户基本信息、订单列表和最近的3个通知。这三个数据来自不同的 API，且相互独立。

## Promise.race()
谁快听谁的：哪个 Promise 最先完成（无论 fulfilled 或 rejected），它的结果就决定了 Promise.race() 的最终状态。
Promise.resolve() 立即完成

- 用途：调用一个第三方 API，但不希望页面无限等待。如果 5 秒内没有响应，就提示“请求超时”。
    防止用户长时间等待，提供更好的错误反馈。

## Promise.any()
- 首个成功即成功：只要有一个 Promise fulfilled，它就立即 fulfilled；只有当所有 Promise 都 rejected 时，它才 rejected（返回 
- 用途：一个天气应用需要获取当前天气。为了提高可用性，它会尝试从3个不同的天气服务提供商获取数据。只要从任何一个服务成功获取到数据，就可以使用。

## Promise.allSettled()
    全部完成才结束：等待所有 Promise 都 settled（fulfilled 或 rejected），然后返回一个包含每个 Promise 结果（含状态和值/原因）的数组。
- 用途：后台管理系统需要批量删除多个文件。希望即使某些文件删除失败，也要知道哪些成功了，哪些失败了，并分别处理（例如，记录日志或提示用户部分失败）。


## async await 与 Promise优缺点
async await 简单，不需要then的链式调用，优雅的异步变同步，但也不能乱用，它是串行的。
如果多个promise值前后有依赖那么 async await 有优势，若没有依赖那么 Promise.all更快

并行业务需求

