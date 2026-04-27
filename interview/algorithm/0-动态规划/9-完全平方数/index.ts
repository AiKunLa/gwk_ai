// 写在外面，多个测试数据之间可以共享，减少计算量
const memo = Array(10001).fill(0)
let index = 0
function numSquares(n: number): number {
    // 使用1~n之间所有的完全平方数 爬楼梯
    if (memo[n] !== 0) return memo[n]
    for (let i = index; i <= n; i++) {
        memo[i] = i
        // 
        for (let j = 1; i - j * j >= 0; j++) {
            memo[i] = Math.min(memo[i], memo[i - j * j] + 1)
        }
    }
    index = n
    return memo[n]
};