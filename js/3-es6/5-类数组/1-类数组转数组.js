function sum(a, b) {
  let args = Array.prototype.concat.apply([], arguments); //apply方法会把第二个参数展开
  console.log(args.reduce((sum, cur) => sum + cur)); //args可以调用数组原生的方法啦
}
sum(1, 2); //3

// sicle  Array.from  ... 展开运算符  concat

function toArray(a, b) {
  // slice 数组截取
  const arr1 = Array.prototype.slice.call(arguments);
  // Array.from 方法
  const arr2 = Array.from(arguments);
  // 展开运算符
  const arr3 = [...arguments];
  // concat 方法是将两个数组连接起来  apply 的第二个参数接收数组或类数组 当最终都是作为一个个参数传递时
  const arr4 = Array.prototype.concat.apply([], arguments);
  const arr5 = [].concat(arguments);
  console.log(arr1, arr2, arr3, arr4, arr5);
}

toArray(1, 2);
