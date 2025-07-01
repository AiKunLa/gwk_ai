//当数组元素都为`BigInt`时可以进行sort
const arr = [1n, 2n, 3n];
arr.sort((a, b) => {
  console.log(typeof a); // bigint
  console.log(typeof b); // bigint
  let re = b - a;
  console.log(typeof re) // bigInt
  return b - a;
});
console.log(arr); // 预期[3n, 2n, 1n]

