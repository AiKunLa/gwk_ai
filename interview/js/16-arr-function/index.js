Array.prototype.isArray = function (arr) {
    if (arr === null || typeof arr === undefined) return false
    return Object.prototype.toString.call(arr) === '[Object Array]'
}