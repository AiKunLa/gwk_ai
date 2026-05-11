function minDistance(word1: string, word2: string): number {
    const m = word1.length
    const n = word2.length

    if (n === 0 || m === 0) return n + m

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1))

    for (let i = 0; i < m + 1; i++) {
        dp[i][0] = i
    }
    for (let i = 0; i < n + 1; i++) {
        dp[0][i] = i
    }

    for (let i = 1; i < m + 1; i++) {
        for (let j = 1; j < n + 1; j++) {
            let left = dp[i][j - 1] + 1
            let up = dp[i - 1][j] + 1
            let left_up = dp[i - 1][j - 1]
            if (word1[i - 1] !== word2[j - 1]) {
                left_up += 1
            }
            dp[i][j] = Math.min(left, up, left_up)
        }
    }

    return dp[m][n]
};