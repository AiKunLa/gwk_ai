function findKthLargest(nums: number[], k: number): number {
    // 第k大的数代也就是 倒数第n-k大的数，他在排序过后在数组种的位置在 n-k
    // 可以使用快速排序 + 剪支来找到这个位置
    // 每次快速排序获取一个 point，point 《 n-k 那么截取右边 否则截取 左边
    return QuickSort(nums, nums.length - k, 0, nums.length - 1)

}

function QuickSort(nums: number[], k: number, left: number, right: number) {
    if (nums[left] === nums[right]) return nums[left]

    let i = left, j = right
    const point = nums[i]
    while (i < j) {
        while (i < j && nums[i] <= point) i++
        while (i < j && nums[j] >= point) j--
        if (i < j) [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    nums[i] = point
    if (i <= k) return QuickSort(nums, k, left, i)
    else return QuickSort(nums, k, i, right)
}
