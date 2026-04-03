/**
 * 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。

请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。

1 <= k <= nums.length <= 105
-104 <= nums[i] <= 104
 * @param nums 
 * @param k 
 */
function findKthLargest1(nums: number[], k: number): number {
    // 进行范围判定
    const len = nums.length
    const resultIndex = len - k

    let left = 0
    let right = len - 1
    while (left <= right) {
        const pointIndex = partition(nums, left, right)
        if (pointIndex === resultIndex) return nums[pointIndex]
        else if (pointIndex < resultIndex) {
            left = pointIndex + 1
        } else {
            right = pointIndex - 1
        }
    }
    return 0
};

function partition(nums: number[], left: number, right: number): number {
    const x = nums[left]
    let i = left - 1
    let j = right + 1

    while (i < j) {
        do { i++ } while (nums[i] < x)
        do { j-- } while (nums[j] > x)
        if (i < j) {
            [nums[i], nums[j]] = [nums[j], nums[i]]
        }
    }
    return j
}

function switchNum(nums: number[], left: number, right: number): void {
    const temp = nums[left]
    nums[left] = nums[right]
    nums[right] = temp
}

