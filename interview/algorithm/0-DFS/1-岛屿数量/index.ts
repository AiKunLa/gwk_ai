function numIslands(grid: string[][]): number {
    if (grid == null || grid[0] == null) return 0

    const n = grid.length
    const m = grid[0].length

    let result = 0

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (grid[i][j] === '0') continue
            result++
            dfs(grid, i, j)
        }
    }
    return result
};

function dfs(grid: string[][], i: number, j: number) {
    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) return
    if (grid[i][j] === '0') return
    grid[i][j] = '0'
    dfs(grid, i + 1, j)
    dfs(grid, i - 1, j)
    dfs(grid, i, j + 1)
    dfs(grid, i, j - 1)
}