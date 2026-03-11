// slice

Array.prototype.mySlice = function (start, end) {
    // 处理 this 为 null/undefined
    if (this == null) {
        throw new TypeError("Cannot read property 'slice' of null or undefined")
    }

    const O = Object(this)
    const len = O.length >>> 0

    // 处理 NaN 和非数值类型
    start = Number(start) || 0
    end = end === undefined ? len : Number(end)

    // 处理负数
    if (start < 0) {
        start = len + start
    }
    if (end < 0) {
        end = len + end
    }

    // 边界限制
    start = Math.max(0, Math.min(start, len))
    end = Math.max(0, Math.min(end, len))

    const sliceArr = []
    for (let i = start; i < end; i++) {
        if (i in O) {
            sliceArr.push(O[i])
        }
    }
    return sliceArr
}