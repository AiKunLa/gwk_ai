function findTargetSumWays(nums: number[], target: number): number {
    let count = 0
    const dfsCallback = (index: number, total: number) => {
        // index === nums.length && total === target
        if (index === nums.length) {
            if (total === target) {
                count++
            }
            return
        }
        dfsCallback(index + 1, total - nums[index])
        dfsCallback(index + 1, total + nums[index])
    }
    dfsCallback(0, 0)
    return count
};




function findTargetSumWays2(nums: number[], target: number): number {
    // 0-1 背包问题，找出有几种组合方式能组合成目标数
    // dp[i] 表示从数组中选取数之和为i的方案的个数
    // dp[i] = dp[]
    const total = nums.reduce((pre, cur) => pre + cur, 0)
    if ((total - target) % 2 !== 0 || total < target) {
        return 0
    }
    const newTarget = (total - target) / 2

    const dp: number[] = Array.from({ length: newTarget + 1 }, () => 0)
    dp[0] = 1

    for (const num of nums) {
        for (let j = newTarget; j >= num; j--) {
            dp[j] = dp[j] + dp[j - num]
        }
    }

    return dp[newTarget]
}

