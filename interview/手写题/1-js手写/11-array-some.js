Array.prototype.mySome = function (callback, args) {
    // 判断this是否为数组
    if (this === null) throw new TypeError("Array.prototype.some called on null or undefined")
    if (typeof callback !== 'function') throw new TypeError('callback is not a function')
    const O = Object(this)
    const len = O.length >> 0
    const T = args
    // 遍历
    for (let i = 0; i < len; i++) {
        if (i in O) {
            const value = O[i]
            if (callback.call(T, value, i, O)) return true
        }
    }
    return false
}