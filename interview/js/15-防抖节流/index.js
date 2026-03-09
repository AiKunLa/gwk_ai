function debance(fn, delay) {
    let target = null
    return (...args) => {
        if (!target) {
            target = setTimeout(() => {
                fn.apply(this, args)
            }, delay)
        } else {
            clearTimeout(target)
        }
    }
}


function trro(fn, delay) {
    let timer = null
    return (...args) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => { fn.apply(this, args) }, delay)
    }
}


// 时间戳方式
function trrolet(fn, delay) {
    let last = 0
    return (...args) => {
        // 若当前时间减去上一次执行的时间大于delay则执行
        const now = Date.now()
        if (now - last > delay) {
            fn.apply(this, args)
            last = now
        }
    }
}

// 定时器方式
function trrolet2(fn, delay) {
    let timer = null
    return (...args) => {
        // 若有定时器在则不做任何事情
        if (!timer) {
            setTimeout(() => {
                fn.apply(this, args)
                clearTimeout(timer)
            }, delay)
        }
    }
}