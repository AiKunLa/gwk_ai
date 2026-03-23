const arr = []
const obj = {

}

function isNull(obj) {
    if (Object.keys(obj).length === 0) console.log('This object is null')
    else console.log('This object is not null')
}

isNull(arr)
isNull(obj)


console.log(Object.getOwnPropertyNames(obj).length)
console.log(Object.getOwnPropertySymbols(obj).length)
console.log(Object.getOwnPropertyNames(arr).length)
console.log(Object.getOwnPropertySymbols(arr).length)

function isEmpty(obj) {
    if (typeof obj != 'object' || obj === null) {
        return false
    }
    return Object.keys(obj) === 0
}