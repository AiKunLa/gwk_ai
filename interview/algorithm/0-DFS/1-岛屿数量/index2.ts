function numIslands(grid: string[][]): number {
    // 求岛屿数量，可以使用深度优先遍历来进行计算，遍历这个二维数组，若val为1则有岛屿，将这个岛屿的所有1设置为0，岛屿数量加1
    // 深度优先遍历岛屿数量：边界条件是 i j要在规定范围之内 i》=0 i《 grid【】
    // 若gird【i】【j】== 0 也结束递归，递归式向四周进行的
    const dfs = (i: number, j: number, grid: string[][]): void => {
        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) return
        if (grid[i][j] === '0') return
        grid[i][j] = '0'
        dfs(i + 1, j, grid)
        dfs(i - 1, j, grid)
        dfs(i, j + 1, grid)
        dfs(i, j - 1, grid)
    }

    let result = 0
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === '0') continue
            result++
            dfs(i, j, grid)
        }
    }
    return result
}