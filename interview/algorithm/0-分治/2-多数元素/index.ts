function majorityElement(nums: number[]): number {
    const len = nums.length
    const map = new Map<number, number>()
    for (let i = 0; i < len; i++) {
        const count = map.get(nums[i]) ?? 0
        const newCount = count + 1
        if (newCount > len / 2) return nums[i]
        map.set(nums[i], newCount)
    }
    return 0
};
/**
 * 候选票数多余其他的就行
 * @param nums 
 * @returns 
 */
function majorityElement1(nums: number[]): number {
    let count = 0
    let candidate = null
    for (let i = 0; i < nums.length; i++) {
        if (count === 0) candidate = nums[i]
        count = (candidate === nums[i]) ? ++count : --count
    }
    return candidate
}