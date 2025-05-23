// 变量会提升到当前作用域的顶部
// 代码分为编译阶段和执行阶段，编译阶段只有一瞬间，他会把声明的变量和函数提前到当前作用域的顶部 来检测语法是否有错误，
// chrome内部有V8引擎，V8引擎会把js代码分为编译阶段（语法检测，转换为二进制）和执行阶段，
showName();// 1.驼峰命名法。2.函数提升
console.log(myName);


var myName = 'Tom' // 3.变量提升 

function showName() {// 函数更加优先
    let b = 100; // b这个变量只有再
    console.log("TAM");
}
