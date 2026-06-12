function DeepCopy(obj, map = new WeakMap()) {
    if (!obj || typeof obj !== 'object') {
        return obj
    }

    if (typeof obj === 'function') {
        return obj
    }

    if (map.has(obj)) {
        return map.get(obj)
    }

    if (obj instanceof Date) {
        const clone = new Date(obj)
        map.set(obj, clone)
        return clone
    }

    if (obj instanceof RegExp) {
        const clone = new RegExp(obj.source, obj.flags)
        map.set(obj, clone)
        return clone
    }

    if (obj instanceof Map) {
        const clone = new Map()
        map.set(obj, clone)
        for (const [key, value] of obj) {
            clone.set(DeepCopy(key, map), DeepCopy(value, map))
        }
        return clone
    }

    if (obj instanceof Set) {
        const clone = new Set()
        map.set(obj, clone)
        for (const v of obj) {
            clone.add(DeepCopy(v, map))
        }
        return clone
    }

    if (Array.isArray(obj)) {
        const clone = []
        map.set(obj, clone)
        for (let i = 0; i < obj.length; i++) {
            clone[i] = DeepCopy(obj[i], map)
        }
        return clone
    }

    const propt = Object.getPrototypeOf(obj)
    const clone = Object.create(propt)
    map.set(obj, clone)

    const allKeys = Reflect.ownKeys(obj)
    for (const key of allKeys) {
        clone[key] = DeepCopy(obj[key], has)
    }
    return clone
}


function deepCopy(value, weekMap = new WeakMap()) {
    // 判断传入的是不是一个对象
    if (!value || typeof value !== 'object') {
        return value
    }

    // 检测是否在weekMap中，存在则不需要递归调用
    if (weekMap.has()) {
        return weekMap.get(value)
    }
    const newObj = Array.isArray(value) ? [] : {}

    // 放入
    weekMap.set(value, newObj)
    for (const key in obj) {
        if (value.hasOwnProperty(key)) {
            newObj[key] = typeof value[key] === 'object' ? deepCopy(obj[key], weekMap) : value[key]
        }
    }
    return newObj
}