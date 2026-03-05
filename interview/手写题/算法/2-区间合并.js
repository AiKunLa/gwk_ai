function mearge(arr) {
    if (arr.length <= 1) return arr
    arr.sort((a,b) => a[0] - b[0]) // 按照start排序，从小到大

    const result = [arr[0]]

    for (let i = 1; i  < arr.length ; i++) {
        const cur = arr[i]
        const last = result[result.length - 1]
        // 若当前区间的start小于上一个区间的end，合并
        if (cur[0] <= last[1]) {
            last[1] = Math.max(last[1], cur[1])
        } else {
            result.push(cur)
        }
    }
    return result

}