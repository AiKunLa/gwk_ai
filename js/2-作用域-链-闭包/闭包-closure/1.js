// 函数与函数参数的关系
// 通过什么可以拿到函数的参数

function add(a, b, c) {
  return a + b + c;
}
add(1, 2, 3);
// 柯里化
let addCurry = curry(add);

// 手写柯里化
function curry(fn) {
  //闭包
  // fn是闭包中的自由变量
  // 包装fn 慢慢收集
  // 返回一个函数
  return function curried(...args) {// args在其中是个自由变量
    if (arguments.length === fn.length) {
      console.log(arguments.length);
      return fn(...args);
    }
    return function (...newArgs) {
      // fn可以在任意时候访问
      return curried(...args, ...newArgs);
    };
  };
}
// 将搜集参数的过程拆分
console.log(addCurry(1)(2)(3));
