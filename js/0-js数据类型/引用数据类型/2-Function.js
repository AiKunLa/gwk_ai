// 创建函数
function eat() {}

// 函数表达式 将函数赋值给变量 也-可以省略函数名
const fn = function() {}

// 箭头函数
const fn2 = () => {}

console.log(fn instanceof Object) // true
console.log(fn instanceof Function) // true
