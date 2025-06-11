// v8引擎
// 变量提升
// 编译阶段
// 执行阶段
// 为什么a以前端方式运行时在window上 因为编译阶段 会把所有的变量提升到顶部 但是赋值不会提升 所以a在window上
var a = 1;
console.log(window.a); // window is not defined 后端运行时 不会有window
// console.log(global.a) // global 是nodejs的全局对象 浏览器中是window
