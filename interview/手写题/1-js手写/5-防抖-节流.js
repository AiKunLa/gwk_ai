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



// 该节流函数与传统节流函数（时间戳法/定时器法）不同：
// - 结合了“时间戳”和“定时器”两种节流思路，既能保证首次立刻执行（leading），又能保证最后一次事件后仍能触发一次（trailing）。
// - 在每次执行时都会判断距离上次触发的时间，如果已过 delay，则立即执行（领先执行）。
// - 如果未到 delay 并且当前没有定时器，则设置定时器于剩余时间后再执行一次，确保尾巴事件也会被调用。
// - 传统的时间戳节流无法处理 trailing，传统的定时器节流首次不会立即执行。
// - 这种方式适合对需要兼顾首尾执行的场景，常用于高频用户输入、页面滚动等场景的节流控制。

// 首次为什么会立即执行？
// 因为 lastTime 初始为 0，首次调用时 now - lastTime 等于 now - 0，肯定大于 delay（现在距离 1970 年很久了），所以 remaining <= 0 成立，直接进入“立即调用”逻辑，fn 立即执行。
// 之后 lastTime 被设置成当前时间，只有等下一次调用距离 lastTime 超过 delay 才会立即执行。

// throttlePro 能实现“拖尾执行”的原因：
// 当处于冷却期间（remaining > 0），如果再次触发，并且没有挂起的 timer，则会设置一个 setTimeout。
// 这样在最后一次触发后，还会有一个定时器在 remaining 毫秒后执行 fn，实现“拖尾”调用（即 trailing）。
// 如果持续触发多次，在冷却期间不会重复设置 timer，只会等到最后一次事件后才触发尾巴调用。

function throttlePro(fn, delay) {
    let lastTime = 0
    let timer = null
    return function (...args) {
        const now = Date.now()
        // 当距离上次执行的时间少于 delay 时，remaining 会大于 0
        // 即：本次触发距离“上一次真正执行 fn”时间不够，还在冷却期
        // 例如 delay=1000，上次执行在 0ms，此时 now 为 600，则 remaining=1000-(600-0)=400>0
        const remaining = delay - (now - lastTime)
        if (remaining <= 0) {
            // 首次或已达间隔，立即执行
            if (timer) {
                clearTimeout(timer)
                timer = null
            }
            fn.apply(this, args)
            lastTime = now
        } else if (!timer) {
            // 拖尾执行逻辑：处于冷却期，仅设置一次定时器，最后一次输入后依然保证有“尾巴”执行
            timer = setTimeout(() => {
                fn.apply(this, args)
                lastTime = Date.now()
                timer = null
            }, remaining)
        }
    }
}
