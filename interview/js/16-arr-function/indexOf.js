/**
 * 找到数组中某个元素第一次出现的index
 * @param {*} searchElement 
 * @param {*} fromIndex 
 */
Array.prototype.myIndexOf = function (searchElement, fromIndex = 0) {
    // 处理this 是否为null 或 undefined，处理fromIndex 不是数字的情况，处理fromIndex 超出数组长度的情况，处理负数fromIndex 的情况
    if (this == null) throw new TypeError('Array.prototype.myIndexOf called on null or undefined')
    const length = this.length >>> 0 // 转为无符号整数
    const O = Object(this)

    if (length === 0) return -1
    fromIndex = fromIndex < 0 ? fromIndex + length : fromIndex

    if (fromIndex < 0) fromIndex = 0
    if (fromIndex >= length) return -1

    for (let i = 0; i < length; i++) {
        if (i in O && O[i] === searchElement) {
            return i
        }
    }
    return -1
}