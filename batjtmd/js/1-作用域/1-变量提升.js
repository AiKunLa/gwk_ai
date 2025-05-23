// 全局作用域
function fn() { // 函数作用域
  let a = 2;
  if (true) {
    var b = 3; // let支持块级作用域  var不支持块级作用域
  }
  console.log(b); // 使用var时 结果为3 使用let时结果为报错
}

if(false){
    var value = 1 // 代码分为编译阶段和执行阶段，使用var声明的变量 在编译时会声明为全局变量
}
console.log(value)//undefined  当使用let声明时结果会报错


fn()