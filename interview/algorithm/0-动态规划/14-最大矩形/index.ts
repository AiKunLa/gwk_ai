function maximalRectangle(matrix: string[][]): number {
    if (!matrix.length || !matrix[0].length) return 0;

    const rows = matrix.length;
    const cols = matrix[0].length;
    const heights: number[] = new Array(cols).fill(0);
    let maxArea = 0;

    // 辅助函数：计算直方图的最大矩形面积（单调栈）
    const largestRectangleArea = (heights: number[]): number => {
        const stack: number[] = [];
        let maxArea = 0;
        // 添加哨兵，确保最后所有元素都能被处理
        const extendedHeights = [...heights, 0];

        for (let i = 0; i < extendedHeights.length; i++) {
            while (stack.length && extendedHeights[i] < extendedHeights[stack[stack.length - 1]]) {
                const height = extendedHeights[stack.pop()!];
                const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }
        return maxArea;
    };

    // 遍历每一行，更新高度数组
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === '1') {
                heights[j] += 1;
            } else {
                heights[j] = 0;
            }
        }
        // 计算当前行对应的直方图最大矩形面积
        maxArea = Math.max(maxArea, largestRectangleArea(heights));
    }

    return maxArea;
}