// 接受一个函数作为参数，若数组中的元素有至少一个满足条件返回true，，若没有满足条件的元素返回false

Array.prototype.mySome = function (callback, thisArg) {
    // this判断 callback 判断
    if (this == null) {
        throw new TypeError('this is null or not defined')
    }
    if (typeof callback !== 'function') {
        throw new TypeError(callback + 'is not a functions')
    }

    const arr = Object(this);
    const len = arr.length >>> 0;
    for (let i = 0; i < len; i++) {
        if (i in arr && callback.call(thisArg, arr[i], i, arr)) {
            return true;
        }
    }
    return false
}