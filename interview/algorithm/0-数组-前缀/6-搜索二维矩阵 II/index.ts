function searchMatrix(matrix: number[][], target: number): boolean {
    // 以右上角数来对比，num > target 排除这一列 j -1 ,num < target 排除这一行 i +1
    const m = matrix.length, n = matrix[0].length
    let i = 0, j = n - 1
    while (i < m && j >= 0) {
        if (matrix[i][j] > target) {
            j--
        } else if (matrix[i][j] < target) {
            i++
        } else {
            return true
        }
    }
    return false
};