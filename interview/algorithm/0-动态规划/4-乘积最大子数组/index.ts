function maxProduct(nums: number[]): number {
    // dp[i] 表示当前区域（以0来划分区域）前面数的乘积
    // dp[i] = dp[i] * nums[i] 

    const dp: number[] = new Array(nums.length).fill(0)
    let max = nums[0]
    dp[0] = nums[0]
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === 0) {
            dp[i] = 0
        } else if (dp[i - 1] === 0) {
            dp[i] = nums[i]
        } else {
            dp[i] = dp[i - 1] * nums[i]
        }
        max = Math.max(nums[i], dp[i], max)
    }
    return max
};

function maxProduct2(nums: number[]): number {
    /*
        维护两个数组，一个记录最小一个记录最大
     */
    const dpMax: number[] = new Array(nums.length).fill(0)
    const dpMin: number[] = new Array(nums.length).fill(0)

    let max = nums[0]
    dpMax[0] = nums[0]
    dpMin[0] = nums[0]
    for (let i = 1; i < nums.length; i++) {
        dpMax[i] = Math.max(dpMax[i - 1] * nums[i], Math.max(dpMin[i - 1] * nums[i], nums[i]))
        dpMin[i] = Math.min(dpMin[i - 1] * nums[i], Math.min(dpMax[i - 1] * nums[i], nums[i]))
        max = Math.max(dpMax[i], max)
    }
    return max
}