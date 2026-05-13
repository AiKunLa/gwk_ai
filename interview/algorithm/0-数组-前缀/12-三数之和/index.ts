function threeSum(nums: number[]): number[][] {
    // 先排序，排序是为了让数组有序，方便之后判断指针移动方向，以及去重,每个指针都需要去重
    nums.sort((a, b) => a - b)
    const n = nums.length
    const result: [number, number, number][] = []
    for (let i = 0; i < n - 2; i++) {
        // 去重
        if (i > 0 && nums[i] == nums[i - 1]) continue
        // 减枝
        if (nums[i] + nums[i + 1] + nums[i + 1] > 0) return result
        let l = i + 1, r = n - 1
        while (l < r) {
            const compur = nums[l] + nums[r] + nums[i]
            if (compur == 0) {
                result.push([nums[i], nums[l++], nums[r--]])
                // 跳过重复数字
                while (l < r && nums[l] == nums[l - 1]) l++
                while (r > l && nums[r] == nums[r + 1]) r--
            } else if (compur < 0) {
                l++
            } else {
                r--
            }
        }
    }
    return result
};