/**
 * @param {number} n
 * @return {number}
 */

// 算法素养
// 为什么要使用递归
// 这是一个自顶向下 f(n)->f(n-1)+f(n-2) ——> 画树形结构
// 发现有重复计算 函数入栈太多  ——》在计算的过程中存在重叠子问题  但我们希望的是每一步都拿到结果 来优化子结构——》 使用memorize 来记忆已经算过的（空间换时间） dp

const f = [];
var climbStairs = function (n) {
  if (n == 1) return 1;
  if (n == 2) return 2;
  if (f[n] === undefined) f[n] = climbStairs(n - 1) + climbStairs(n - 2);
  return f[n];
};
console.log(climbStairs(100));

// 记忆化递归
const memorize = function (fn) {
  let cache = {};
  return function (...args) {
    if (cache[args]) return cache[args];
    cache[args] = fn.apply(this, args);
    return cache[args];
  };
};
const climbStairs = memorize(function (n) {
  if (n <= 2) return n;
  return climbStairs(n - 1) + climbStairs(n - 2);
});
console.log(climbStairs(100));

// 自底向上
// f(1) = 1 f(2) = 2 f(3)= f(1)+f(2)
// 空间复杂度O(1) 不需要而外的空间

// 递归——》memorize——》dp  在计算的过程中存在重叠子问题  但我们希望的是每一步都拿到结果 来优化子结构

// 从最小子问题开始推-有局部最优到全局最优

// dp 动态规划
// 为什么要可以使用动态规划 最值问题

const climbStairs2 = function (n) {
  if (n <= 2) return n;
  const dp = [];
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]; // 状态转移
  }
  return dp[n];
};
