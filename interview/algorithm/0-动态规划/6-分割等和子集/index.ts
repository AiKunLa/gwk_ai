function canPartition(nums: number[]): boolean {
    // 先求和，和为奇数则为false ，遍历，找寻和为总数一半的即可
    // 也就是排列组合, 0-1 背包问题
    const totalSum = nums.reduce((pre, cur) => cur + pre)
    if (totalSum % 2 !== 0) return false
    const tagertSum = totalSum / 2

    const dp: boolean[] = Array.from({ length: tagertSum + 1 }, () => false)
    dp[0] = true
    // 只需要dp[tagertSum] = true 即可

    for (let i = 0; i < nums.length; i++) {
        for (let j = tagertSum; j >= nums[i]; j--) {
            if (dp[j - nums[i]]) dp[j] = true
        }
    }
    return dp[tagertSum]
};