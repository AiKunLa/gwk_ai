function findKthLargest(nums, k) {
    return quickselect(nums, 0, nums.length - 1, nums.length - k)
}

function quickselect(nums, l, r, k) {
    if (l === r) return nums[k];
    let i = l - 1, j = r + 1, x = nums[l]
    while (i < j) {
        do { i++ } while (nums[i] < x)
        do { j-- } while (nums[j] > x)  // 修复：j-- 不是 j++
        if (i < j) {
            [nums[i], nums[j]] = [nums[j], nums[i]]
        }
    }
    if (k <= j) return quickselect(nums, l, j, k)
    else return quickselect(nums, j + 1, r, k)
}
