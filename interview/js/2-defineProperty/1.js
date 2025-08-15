var obj = {}; //对象
// es5 提供的api 浏览器兼容性更加好

// Object.defineProperty(obj, "num", {
//   value: 1,
//   configurable: true, // 这个属性的配置是否可以更改  可配置
//   writable: true, // 这个属性的值是否可以修改 可写
//   enumerable: true, // 这个属性是否可以被枚举 可枚举  可以被for in 循环枚举

//   get: function () {
//     return this.value;
//   },
//   set: function (newValue) {
//     this.value = newValue;
//   },
// });

// obj.num = 2;
// console.log(obj.num);
// console.log(Object.getOwnPropertyDescriptor(obj, "num"));

Object.defineProperty(obj, "name", {
  writable: true,
});

obj.name = "Bob";
console.log(obj.name);
// 若只配置一项，那么其他项默认值为false
console.log(Object.getOwnPropertyDescriptor(obj, "name"));
