const obj = {
  name: "张三",
  age: 18,
  sex: "男",
  friends: ["", "", ""],
  86 : "Do not",
  [1]: 'one',
  // 匿名函数
  sayHi: function () {
    console.log("hi");
  },
};
console.log([1].toString()) // 1
console.log(obj[1])
