const similar = {
    0: '123',
    1: '456',
    2: '789',
    length: 3
}

const arr = Array.from(similar)
console.log(arr) // ['123', '456', '789']

const strArr = Array.from('12345')
console.log(strArr) // ['1', '2', '3', '4', '5']


// 只能用于可迭代对象(如arguments、NodeList等)
// const arr1 = [...similar] 
// console.log(arr1)

const arr2 = Array.prototype.slice.call(similar)
console.log(arr2) // ['123', '456', '789']



