let a;
console.log(typeof a); // undefined typeof是一个操作符，不是函数，所以不用加括号
// undefined 在js中是一种数据类型，所以要加引号
a = 1;

const arr = [1, 2, 3, 4, 5]; //
console.log(typeof arr); // object 数组也是对象，所以typeof返回object

const date = new Date(); // 日期对象
console.log(typeof date); // object 日期对象也是对象，所以typeof返回object

// 如何区分Object的这些类型呢？
Array.isArray(arr); // true 是数组
// 1. instanceof 运算符
// 2. constructor 属性
// 3. Object.prototype.toString.call() 方法
//
console.log(Object.prototype.toString.call(arr)); // [object Array] 是数组
console.log(Object.prototype.toString.call(date)); // [object Date] 是日期对象

function getType(obj) {
  // 字符串截取
  // 8~type.length-1 截取字符串
  return Object.prototype.toString.call(obj).slice(8, type.length - 1); // 左闭右开
}
// 会在MDN文档上查找相关的文档
function TypeOf(obj) {
    // 8~type.length-1 截取字符串  第一个参数是起始位置 第二个参数是结束位置 不写第二个参数表示到末尾
    return Object.prototype.toString.call(obj).slice(8, -1); // -1 表示最后一个字符 从右向左计算-末尾开始计算
}

console.log(getType(date)); // Date 是日期对象
console.log(getType(arr)); // Array 是数组



