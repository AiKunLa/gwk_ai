function coinChange(coins: number[], amount: number): number {
    // dp[i] 表示抵达i金额所用的最小硬币数量
    // dp[i] = min(dp[i-coins[0~i]])
    const dp: number[] = new Array(amount + 1).fill(Infinity)
    dp[0] = 0
    // const coinsMap: Map<number, number> = new Map()
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1)
            }
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount]
};