
/**
 * 在一个由 '0' 和 '1' 组成的二维矩阵内，找到只包含 '1' 的最大正方形，并返回其面积。
 * @param matrix 
 */
function maximalSquare(matrix: string[][]): number {
    // dp[i][j] 表示以 i，j右下角正方形的最大边长
    // 状态转移方程 dp[i][j] = min(dp[i-1][j],dp[[i][j-1],dp[i-1][j-1]])

    if (matrix == null || matrix[0] == null) return 0

    const width: number = matrix.length
    const height: number = matrix[0].length

    const dp: number[][] = Array.from({ length: width }, () => new Array(height).fill(0))


    let max_side = 0
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (matrix[i][j] === '1') {
                if (i === 0 || j === 0) {
                    dp[i][j] = 1
                } else {
                    dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1
                }
                max_side = Math.max(max_side, dp[i][j])
            }
        }
    }


    return max_side * max_side
};