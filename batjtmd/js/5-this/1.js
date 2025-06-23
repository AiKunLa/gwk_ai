"use strict";//严格模式
var a = 10; // 严格模式下，定义的变量 
// 立即执行函数   自调用函数
(function a() {
  a = 20;
  console.log(a);
})
();
