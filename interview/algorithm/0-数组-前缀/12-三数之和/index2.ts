
/**
 * 三数之和 next
 */

function threeSum(nums: number[]): number[][] {
    // 先进行升序排序便于之后去重，然后遍历整个数组0~n-2
    // 遍历先要进行去重，若num[i] = num[i-1],则去重continue
    // 剪枝，若num[i] + num[i+1] + num[i+1] 大于0 则说明之后的都是大于0的
    // 进入双指针遍历，找出compur = num[i] + num[l] + num[r] 为0的位置
    // 若compur < 0 则l ++ 若 compur > 0 则r--。这样去找， 循环条件是r<l
    nums.sort((a, b) => a - b)
    const n = nums.length
    const resultArr: [number, number, number][] = []

    for (let i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue
        if ((nums[i] + nums[i + 1] + nums[i + 2]) > 0) break
        let l = i + 1, r = n - 1
        while (l < r) {
            const compur = nums[i] + nums[l] + nums[r]
            if (compur == 0) {
                resultArr.push([nums[i], nums[l], nums[r]])
                // 去重
                while (l < r && nums[l] == nums[l + 1]) {
                    l++
                }
                while (r > l && nums[r] == nums[r - 1]) {
                    r--
                }
                l++
                r--
            } else if (compur > 0) {
                r--
            } else {
                l++
            }
        }
    }
    return resultArr

}