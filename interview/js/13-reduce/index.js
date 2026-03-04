Array.prototype.myReudce = function (callback, initialValue) {
    if (typeof callback !== 'function'){
        throw new TypeError(callback + ' is not a function');
    }
    const arr = this
    // 判读是否有传入的起始值
    let hasInitialValue = arguments.length > 1

    if(arr.length === 0 && !hasInitialValue){
        throw new TypeError("Reduce of empty array with no initial value")
    }

    // 确定起始积累和起始下标
    let accumulator = hasInitialValue ? initialValue : arr[0]
    let index = hasInitialValue ? 1 : 0


    for(let i = index ; i<arr.length;i++){
        accumulator = callback(accumulator,arr[i],i,arr)
    }

    return accumulator
}