function countBits(n: number): number[] {
    // 动态规划
    // 对于偶数 d[i] = d[i/2] 
    // 对于奇数 d[i] = d[i-1]
    const dp: number[] = new Array(n + 1).fill(0)
    for (let i = 1; i <= n; i++) {
        if (i % 2 !== 0) {
            // 奇数
            dp[i] = dp[i - 1]
        } else {
            dp[i] = dp[i / 2]
        }
    }
    return dp
};
/**
 * 使用 & 来判断当前位是否为1 使用>> 将二进制向右移一位
 * @param n 
 * @returns 
 */
function countBits2(n: number): number[] {
    const res: number[] = new Array(n + 1)
    for (let i = 0; i <= n; i++) {
        let count = 0
        let num = i
        while (num) {
            count += num & 1
            num = num >> 1
        }
        res[i] = count
    }
    return res
}