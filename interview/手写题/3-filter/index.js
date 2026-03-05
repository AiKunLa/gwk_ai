
Array.prototype.myFilter = function (callback, thisArg) {
    if (typeof callback !== "function") {
        throw new TypeError('callback must be a function')
    }

    const result = []

    for (let i = 0; i < this.length; i++) {
        // 跳过不存在的属性，或者属性值为undefined的情况，hasOwnProperty判断是否是对象自身的属性
        if (!Object.prototype.hasOwnProperty.call(this, i)) continue
        if (callback.call(thisArg, this[i], i, this)) {
            result.push(this[i])
        }
    }
    return result

}