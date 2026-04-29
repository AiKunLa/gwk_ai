function lengthOfLIS(nums: number[]): number {
    // 动态规划 + HashMap
    const dp: number[] = Array(nums.length).fill(0)
    dp[0] = 1
    let maxLen = 0
    for (let i = 1; i < nums.length; i++) {
        let curMax = dp[i]
        for (let j = i - 1; j > 0; j--) {
            // 若之前子序列长度大于剩余遍历的长度则直接结束，应为这是最大的值了
            if (curMax >= j) break
            // 必须满足 当前的num要大于之前的num
            if (nums[j] < nums[i]) {
                curMax = Math.max(curMax, dp[j])
            }
        }
        dp[i] = curMax + 1
        maxLen = Math.max(dp[i], maxLen)
    }
    return maxLen
};