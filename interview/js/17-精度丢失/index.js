// 浮点数精度问题演示
console.log(0.1 + 0.2)  // 0.30000000000000004

// 直接比较会失败
console.log(0.1 + 0.2 === 0.3)  // false

// 使用 Number.EPSILON 比较浮点数
function areEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON
}

console.log(areEqual(0.1 + 0.2, 0.3))  // true

/**
 * 通过放大倍数转为整数比较
 * @param {number} a 
 * @param {number} b 
 * @param {number} precision 小数精度，默认为 10 (根据业务调整)
 */
function isFloatEqualByScale(a, b, precision = 10) {
  const factor = Math.pow(10, precision); // 10 的 10次方
  // 注意：Math.round 用于消除放大过程中可能产生的微小尾数
  const intA = Math.round(a * factor);
  const intB = Math.round(b * factor);
  
  return intA === intB;
}

// 测试
console.log(isFloatEqualByScale(0.1 + 0.2, 0.3, 10)); // true
// 金额场景示例 (2位小数)
console.log(isFloatEqualByScale(0.1 + 0.2, 0.3, 2)); // true