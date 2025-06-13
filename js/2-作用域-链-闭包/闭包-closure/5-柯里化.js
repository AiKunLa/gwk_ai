function add() {
  // 将参数转为数组
  const args = Array.from(arguments);
  // 作为返回函数 收集参数
  const adder = function () {
    args.push(...arguments);
    return adder; // 再返回
  };
  // 使用toString 当需要字符串化时自动计算总和
  adder.toString = function () {
    return args.reduce((a, b) => a + b);
  };
  return adder;
}

console.log(add(1)(2)(3) + "");
