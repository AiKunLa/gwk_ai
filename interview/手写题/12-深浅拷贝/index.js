
// keys assing 拓展运算符

function Copy(obj) {
    // 判断是否是对象
    if (obj === null || typeof obj !== 'object') {
        return obj
    }
    // 循环遍历对象进行拷贝，基本类型之间赋值，引用类型拷贝地址
    const newObj = Array.isArray(obj) ? [] : {}

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key]
        }
    }
    return newObj
}


function Copy(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    const newObj = Array.isArray(obj) ? [] : {}
    for (const key in newObj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key]
        }
    }

    return newObj
}