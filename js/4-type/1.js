// 没有参数校验
/**
 *@func 两数之和
 * @param {number} a
 * @param {number} b
 * @returns number
 */
/*
函数的定义
函数编写者
 */
function add(a, b) {
  if (typeof a !== "number" || typeof b !== "number" || isNaN(a) || isNaN(b)) {
    // typeof 是js中内置的运算符 只能判断基本数据类型 并返回字符串
    throw new TypeError("参数必须是数字");
  }
  if (!isFinite(a) || !isFinite(b)) {
    // isFinite 判断的是是否
    throw new TypeError("参数必须是有限数字");
  }
  return a + b;
}

console.log(add(1, 2)); // 3
