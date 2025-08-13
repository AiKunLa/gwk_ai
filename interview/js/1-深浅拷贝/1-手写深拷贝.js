let obj1 = {
  name: "张三",
  age: 18,
};
// 不是复制，而是引用传递
let obj2 = obj1;
obj2.name = "李四";

// 使用Object.assign() 来实现
let arr1 = [1, 2, 3];
let arr2 = Object.assign([], arr1);


// 使用slice() 方法来切割数组   这是浅拷贝
const arr3 = arr1.slice();

const arr4 = [[1,2],[]] // 若值是对象 则slice 只会拷贝对象引用
const arr5 = arr4.slice();
arr5[0][0] = 100;
console.log(arr4);


// contact 由于合并多个数组



