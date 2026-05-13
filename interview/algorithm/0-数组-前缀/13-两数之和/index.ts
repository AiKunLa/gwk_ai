function twoSum(nums: number[], target: number): number[] {
    const map: Map<number, number> = new Map()
    for (let i = 0; i < nums.length; i++) {
        let compur = target - nums[i]
        if (map.has(compur)) {
            return [map.get(compur), i]
        }
        map.set(nums[i], i)
    }
    return []
};