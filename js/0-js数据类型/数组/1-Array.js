// const arr = new Array(10).fill().map(() => new Array(10).fill(0));
// console.log(arr);

const arr = new Array(10).fill(0);
// console.log(arr);
// arr[15] = 1;
// // 输出arr中所有的key
// for (let key of arr.keys()) {
//   console.log(key);
// }

// arr.forEach((item, index) => {
//   console.log(item, index);
// });

const a1 = Array.from(new Array(26), (val, index) =>
  String.fromCharCode(index + 65)
);
console.log(a1)