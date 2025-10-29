function debounce(fn,delay){
    let timer = null
    return function(...args){
        if(!timer){
            clearTimeout(timer)
            timer = setTimeout(() => {
                fn.call(this,args)
            }, delay);
        }
    }
}

const handleInput = debounce((value)=>{console.log(value)},2000)
handleInput('a'); // 不执行
handleInput('ab'); // 不执行
handleInput('abc'); // 500ms 后执行 

// 这个节流函数是有问题的：
// 1. throttle（节流）思想是规定单位时间只触发一次函数，在单位时间内，无论触发多少次函数，只会执行一次。
// 2. 本函数没有将 timer 赋值，导致 if(timer) 判断恒为 false，每次都会setTimeout，因此达不到节流效果。
// 3. clearTimeout(timer) 只是清除了 timer 的引用，对 setTimeout 没有效果。
// 正确写法如下：

function throttle(fn, delay) {
    let timer = null
    return function (...args) {
        if (timer) return
        timer = setTimeout(() => {
            fn.apply(this, args)
            timer = null
        }, delay)
    }
}

// 这个节流函数实际上基本是可以工作的，但存在一些细微问题：
// 1. 首次调用会延迟 delay 毫秒后才第一次进入，有时期望首次立即执行。
// 2. 内部变量 later 的初始值为 0，相当于现在距离 1970 年已经很久，第一个永远会执行，但如果将 throttle 用在 SSR 等环境（无 window、无时间起点）可能出错。
// 3. 变量命名不太语义化，later 非常容易与 setTimeout 的 ID 概念混淆，建议重命名为 lastTime。
// 4. 该实现是时间戳版，不能最后一次事件后“尾巴”再触发（不 trailing）。
// 更规范些的写法如下：

function throttle_Time(fn, delay) {
    let lastTime = 0
    return function (...args) {
        const now = Date.now()
        if (now - lastTime >= delay) {
            fn.apply(this, args)
            lastTime = now
        }
    }
}
