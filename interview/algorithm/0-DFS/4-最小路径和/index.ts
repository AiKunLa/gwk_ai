function minPathSum(grid: number[][]): number {
    const m = grid.length, n = grid[0].length
    const targer: number[][] = Array.from({ length: m }, () => Array(n).fill(-1))
    const dfs = (i: number, j: number): number => {
        if (i < 0 || j < 0) {
            return Infinity
        }
        if (i === 0 && j === 0) {
            return grid[i][j]
        }
        // 若已经计算过
        if (targer[i][j] !== -1) {
            return targer[i][j]
        }
        return targer[i][j] = Math.min(dfs(i - 1, j), dfs(i, j - 1)) + grid[i][j]
    }

    return dfs(m - 1, n - 1)
};