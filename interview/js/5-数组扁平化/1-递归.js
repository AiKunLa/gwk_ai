const flatten = (arr) => {
  let result = [];
  for (let item of arr) {
    // 若item是一个数组，则递归
    if (Array.isArray(item)) {
        // 合并递归后的数组
      result = result.concat(flatten(item));
    } else {
      result.push(item);
    }
  }
  return result;
};

const arr = [
  2,
  56,
  35,
  5,
  [63, 6, 53, 55, [5652, 5], [8654684]],
  [5468, 13, 1],
];

console.log(flatten(arr));
