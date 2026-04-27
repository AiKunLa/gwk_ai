function bgb(maxContain: number, weights: number[], value: number[]): number {
    const len = weights.length
    const dp: number[][] = Array.from({ length: len + 1 }, () => Array(maxContain + 1).fill(0))

    // 物品范围
    for (let i = 1; i <= len; i++) {
        // 容量范围
        for (let weight = 1; weight <= maxContain; weight++) {
            if (weights[i - 1] <= weight)
                dp[i][weight] = Math.max(dp[i - 1][weight], dp[i - 1][weight - weights[i - 1]] + value[i - 1])
            else {
                dp[i][weight] = dp[i - 1][weight]
            }
        }
    }
    return dp[len][weights.length]
}