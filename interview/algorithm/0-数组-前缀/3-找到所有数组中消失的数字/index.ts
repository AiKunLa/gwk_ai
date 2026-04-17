function findDisappearedNumbers1(nums: number[]): number[] {
    //初始化一个从1~n的map，key为1~n
    //遍历数组值，若存在map中则删除
    // 最后将map 转为数组
    const map: Map<number, number> = new Map()
    for (let i = 1; i <= nums.length; i++) {
        map.set(i, 0)
    }
    for (let i = 0; i < nums.length; i++) {
        if (map.has(i))
            map.delete(i)
    }
    return [...map.keys()]
};


function findDisappearedNumbers(nums: number[]): number[] {
    const len = nums.length
    const set: Set<number> = new Set(nums)
    const res: number[] = []
    for (let i = 1; i <= len; i++) {
        if (!set.has(i)) res.push(i)
    }
    return res
}