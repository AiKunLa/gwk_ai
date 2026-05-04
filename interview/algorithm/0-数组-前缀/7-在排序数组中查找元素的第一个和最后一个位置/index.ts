
// 二分法 然后向前后查询
function searchRange(nums: number[], target: number): number[] {
    let left = 0, right = nums.length - 1, point = 0
    while (left <= right) {
        point = Math.floor((left + right) / 2)
        if (nums[point] === target) {
            break
        } else if (nums[point] > target) {
            right = point - 1
        } else {
            left = point + 1
        }
    }
    if (nums[point] !== target) return [-1, -1]
    left = point
    right = point


    while (left > 0 && nums[left - 1] === target) left--
    while (right < nums.length && nums[right + 1] === target) right++
    return [left, right]
};