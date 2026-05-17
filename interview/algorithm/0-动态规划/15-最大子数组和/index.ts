function maxSubArray(nums: number[]): number {
    // 采用动态规划来解决，由于只需要找出最大的连续子串，题目只要求返回结果，不要求得到最大的连续子数组是哪一个。
    // 任何子数组都会以某个数为结束，若知道以每个位置为结尾的最大子数组和，那么在这些子数组中肯定有一个最大
    // 而以当nums[i] 为结束的数组的最大值和以num[i-1]为结尾的最大子数组和有关系，所以可以使用动态规划
    let preDp: number = 0
    let maxNum: number = -Infinity
    for (let i = 0; i < nums.length; i++) {
        preDp = preDp < 0 ? nums[i] : preDp + nums[i]
        maxNum = maxNum > preDp ? maxNum : preDp
    }
    return maxNum
};