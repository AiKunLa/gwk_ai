/**
 * Array.prototype.myFind 实现
 * 返回满足条件的第一个元素值，如果没有满足条件的元素则返回 undefined
 *
 * @param {Function} callback - 断言函数，接收 (element, index, array) 参数
 * @param {*} [thisArg] - callback 执行时的 this 指向
 * @returns {*} 满足条件的第一个元素值，或 undefined
 */
Array.prototype.myFind = function (callback, thisArg) {
    // 1. 类型检查：确保 this 不为 null 或 undefined
    if (this == null) throw new TypeError("Array.prototype.find called on null or undefined")
    // 2. 类型检查：确保 callback 为函数
    if (typeof callback !== 'function') throw new TypeError("callback is not a function")

    // 3. 将 this 转为对象（处理原始类型如 [] 的包装）
    const O = Object(this)
    // 4. 获取数组长度，使用无符号右移确保为非负整数
    const len = O.length >>> 0

    // 5. 遍历数组
    for (let i = 0; i < len; i++) {
        // 6. 检查索引 i 是否存在于数组中（跳过稀疏数组的空位）
        if (i in O) {
            const value = O[i]
            // 7. 调用 callback，传入 (元素值, 索引, 原数组)
            //    使用 thisArg 绑定 this 指向
            if (callback.call(thisArg, value, i, O)) {
                // 8. 若 callback 返回 true，则返回当前元素值
                return value
            }
        }
    }
    // 9. 遍历完毕无满足条件的元素，返回 undefined
    return undefined
}