function merge(intervals: number[][]): number[][] {
    // 排序 先从小到大 ，则每一项第一个都比后面小，之后只需要比较第二个元素与后一个第一个元素与第二个元素即可
    // 若大于后一个第一个元素 a[1] > b[0] 则可以合并， 合并区间的第二位为 max(a[1],b[1])

    const sortedIntervlas = intervals.sort((a, b) => a[0] - b[0])
    const res: number[][] = [sortedIntervlas[0]]
    for (let i = 1; i < sortedIntervlas.length; i++) {
        if (res[res.length - 1][1] > sortedIntervlas[i][0]) {
            res[res.length - 1][1] = Math.max(res[res.length - 1][1], sortedIntervlas[i][1])
        } else {
            res.push(sortedIntervlas[i])
        }
    }
    return res
};