console.log('同步代码开始执行')

queueMicrotask(()=>{
    console.log('queueMicrotask执行')
})

const promise = new Promise((resolve)=>{
    console.log('promise执行')
    resolve('promise执行')
})

promise.then((res)=>{
    console.log(res)
})




console.log('同步代码执行结束')