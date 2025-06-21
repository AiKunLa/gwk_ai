/**
 * @param {number} n
 * @return {number}
 */
// var fib = function (n) {
//   if (n <= 1) return n;
//   return fib(n - 1) + fib(n - 2);
// };
// console.log(fib(10));

// 非递归
var other = function (n) {
  let arr = [0, 1];
  for (let i = 0; i <= n; i++) {
    arr.push(arr[i] + arr[i + 1]);
  }
  return arr[n];
};
console.log(other(10));

// 闭包形成 记忆了之前计算过的
function memorize() {
  let cache = [];
  return function fib(n) {
    if (n <= 1) return n;
    if (cache[n]) return cache[n];
    cache[n] = fib(n - 1) + fib(n - 2);
    return cache[n];
  };
}
const fib = memorize();
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
arr[11] = 11;
console.log(arr[11]);
