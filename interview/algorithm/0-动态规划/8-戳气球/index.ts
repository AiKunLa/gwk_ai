function maxCoins(nums: number[]): number {
    nums.unshift(1)
    nums.push(1)
    const len = nums.length

    const dp: number[][] = Array.from({ length: len }, () => new Array(len).fill(0))

    // 遍历这个区间内的所有k ，找出这个以这个k戳破气球的最大值
    const rang_bast = (i: number, j: number) => {
        let max = 0
        for (let k = i + 1; k < j; k++) {
            max = Math.max((dp[i][k] + nums[i] * nums[k] * nums[j] + dp[k][j]), max)
        }
        dp[i][j] = max
    }

    // 区间大小 从小到大，最小为2
    for (let i = 2; i < len; i++) {
        // 以当前区间来滑动计算 dp[j][j+i]
        for (let j = 0; j < len - i; j++) {
            rang_bast(j, j + i)
        }
    }

    return dp[0][len - 1]
};