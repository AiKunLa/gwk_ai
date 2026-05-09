function uniquePaths(m: number, n: number): number {
    const memo: number[][] = Array.from({ length: m }, () => Array(n).fill(0))
    // 自低向上
    const dfs = (i: number, j: number): number => {
        // 超出边界
        if (i < 0 || j < 0) {
            return 0
        }
        // 到达最上层
        if (i === 0 && j === 0) return 1
        // 存储缓存
        if (memo[i][j] !== 0) {
            return memo[i][j]
        }
        return memo[i][j] = dfs(i - 1, j) + dfs(i, j - 1)
    }
    return dfs(m - 1, n - 1)
};