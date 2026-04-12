function singleNumber(nums: number[]): number {
    // 第一次出现加 第二次出现减
    let result = 0
    for (const val of nums) {
        result = result ^ val
    }
    return result
};