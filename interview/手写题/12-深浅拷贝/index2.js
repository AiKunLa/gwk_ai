function Copy(obj) {
    if (obj !== null && typeof obj !== "object") return obj
    const newObj = Array.isArray(obj) ? [] : {}
    for (const key in obj) {
        if (obj.hasowenProptorype(key)) {
            newObj[key] = obj[key]
        }
    }
    return newObj
}