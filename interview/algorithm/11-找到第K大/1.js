/**
 * 给定一个无序的整数数组，如何找到其中第 K 大的元素？如果要求时间复杂度尽量接近 O(n)，
 * 我们通常会借鉴哪种经典排序算法的 Partition（分区） 思想来实现？
 * 
 */

function findKthLargest(nums, k) {
    // 使用快排之后直接取
    // 确定左右边界 确定第k大元素的下标 targetIndex
    // 使用快排获取midpoint，若midpoint小于 targetIndex 则改变左边界，若大则改变右边界
    const len = nums.length
    const targetIndex = len - k
    let left = 0
    let right = len - 1

    while (left <= right) {
        const midpoint = partition(nums, left, right)
        if (midpoint === targetIndex) {
            return nums[midpoint]
        } else if (midpoint < targetIndex) {
            left = midpoint + 1
        } else {
            right = midpoint - 1
        }
    }
    return nums[left]
}

function partition(nums, left, right) {
    // 随机选一个
    const randomIdx = Math.floor(Math.random() * (right - left + 1)) + left
    // 交换元素
    const temp = nums[randomIdx]
    nums[randomIdx] = nums[right]
    nums[right] = temp
    const pivot = nums[right]

    let i = left
    for (let j = left; j < right; j++) {
        if (nums[j] < pivot) {
            // 交换元素
            const temp2 = nums[i]
            nums[i] = nums[j]
            nums[j] = temp2
            i++
        }
    }
    // 交换元素
    const temp3 = nums[i]
    nums[i] = nums[right]
    nums[right] = temp3
    return i;
}

// 测试
console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2)) // 输出: 5
console.log(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)) // 输出: 4

module.exports = { findKthLargest }