function isInterfaceOf(obj, Construct) {
    if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) return false
    let poto = Object.getPrototypeOf(obj)
    while (poto !== null) {
        if (poto === Construct.prototype) return true
        poto = Object.getPrototypeOf(poto)
    }
    return false
}