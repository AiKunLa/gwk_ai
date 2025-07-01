// 结果为NaN的运算
let res = 0 / 0 
console.log(res) // NaN
console.log(Number('abc')) // NaN

console.log(typeof res) // number

console.log(Number.isNaN(res)) // true
console.log(NaN === NaN) // false

