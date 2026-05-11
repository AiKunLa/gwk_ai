/**
 Do not return anything, modify nums in-place instead.
 */
function sortColors(nums: number[]): void {
    let p0 = 0, p1 = 0
    for (let i = 0; i < nums.length; i++) {
        const curNum = nums[i]
        // 先置为2
        nums[i] = 2
        // 0~1的所有长度
        if (curNum <= 1) {
            nums[p1++] = 1
        }
        // 0的长度
        if (curNum === 0) {
            nums[p0++] = 0
        }
    }
};