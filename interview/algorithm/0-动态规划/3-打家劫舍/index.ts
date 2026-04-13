function rob(nums: number[]): number {
    // 不能偷相邻房间
    /**
     * 动态规划
     * dp[i] 表示 当前房子累计能够获取最大金额
     * dp[i] = Max(dp[0~(i-2)]) + nums[i]
     */
    const dp: number[] = new Array(nums.length).fill(0)
    let max = nums[0], preMax = 0
    dp[0] = nums[0]
    for (let i = 1; i < nums.length; i++) {
        dp[i] = preMax + nums[i]
        preMax = preMax < dp[i - 1] ? dp[i - 1] : preMax
        max = max < dp[i] ? dp[i] : max
    }
    return max
};