function search(nums: number[], target: number): number {
    // 找到数组中的最小值 对两边进行二分
    const findMin = (): number => {
        let left = 0, right = nums.length - 1
        while (left < right) {
            const mid = Math.floor((left + right) / 2)
            if (nums[mid] < nums[nums.length - 1]) {
                // 若小于最右边则说明 在 i~n-1
                right = mid
            } else {
                left = mid + 1
            }
        }
        return right
    }

    // 真的二分
    const lowerBound = (left: number, right: number): number => {
        while (left <= right) {
            const mid = Math.floor((left + right) / 2)
            if (nums[mid] === target) {
                return mid
            } else if (nums[mid] < target) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
        return -1
    }

    const midIndex = findMin()
    if (target > nums[nums.length - 1]) {
        return lowerBound(0, midIndex - 1)
    }
    return lowerBound(midIndex, nums.length - 1)

};