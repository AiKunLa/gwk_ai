function twoSum(nums: number[], target: number): number[] {
    //遍历数组，并使用Map来存储遍历的数和index，在遍历的过程中 若target - num[i] 在Map中出现了，那么就可以找到这个结果 
    const map: Map<number, number> = new Map()
    for (let i = 0; i < nums.length; i++) {
        const val = target - nums[i]
        if (map.size && map.has(val)) {
            return [map.get(val), i]
        }
        map.set(nums[i], i)
    }
    return []
}