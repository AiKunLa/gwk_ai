console.log(0 / 0); // NaN 表示无效或者没有定义的数字类型
console.log(1 / 0); // Infinity 表示无穷大的数字类型
console.log(-1 / 0); // -Infinity 表示无穷小的数字类型
console.log(1 / 1); // 1 表示正常的数字类型
console.log(1 / 2); // 0.5 表示正常的数字类型
console.log(Math.sqrt(-1))  // NaN 表示无效或者没有定义的数字类型
console.log(parseInt("123abc")); // 结果是123 只要遇到非数字字符就会停止解析 开头的空格也会被忽略 开头的正负号也会被忽略 开头只要是数字字符就会被解析
console.log(parseInt("abc123")); // 结果是NaN
console.log(Number(undefined)); // NaN 表示无效或者没有定义的数字类型
console.log(NaN === NaN); // false NaN 是无效或者没有定义的数字类型 所以NaN 不等于NaN