function reconstructQueue(people: number[][]): number[][] {
    // 排序 根据身高 从大到小，根据前面的人数重小到大
    //
    // 一般这种数对，还涉及排序的，根据第一个元素正向排序，根据第二个元素反向排序，或者根据第一个元素反向排序，根据第二个元素正向排序，往往能够简化解题过程。
    // 定义结果数组，遍历排序后的数组
    people.sort((a: number[], b: number[]) => {
        if (a[0] !== b[0]) {
            return b[0] - a[0]
        }
        return a[1] - b[1]
    })

    const res: number[][] = []
    for (const currentPo of people) {
        // let len = res.length
        // if (len <= currentPo[1]) {
        //     res.push(currentPo)
        // } else {
        // 插入数组中第currentPo[1]的位置
        res.splice(currentPo[1], 0, currentPo)
        // }
    }
    return res
};