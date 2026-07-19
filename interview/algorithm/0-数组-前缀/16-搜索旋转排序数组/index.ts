function search(nums: number[], target: number): number {
    // 使用二分查找法
    // 旋转过后的数组有两段上升区域，二分获取的point 有两种情况
    // 所以先要找到数组中的最小值也就是那个断点，然后就是比较point在那个区间内，再去这个区间进行二分
    let l = 0, r = nums.length
    while (l < r) {
        const point = Math.floor((l + r) / 2)
        if (nums[point] < nums[nums.length - 1]) {
            r = point
        } else {
            l = point + 1
        }
    }
    const lowerBound = (l: number, r: number): number => {
        while (l <= r) {
            const point = Math.floor((l + r) / 2)
            if (nums[point] == target) return point
            else if (nums[point] > target) {
                r = point - 1
            } else {
                l = point + 1
            }
        }
        return -1
    }

    if (target > nums[nums.length - 1]) return lowerBound(0, r - 1)
    return lowerBound(r, nums.length - 1)
}
function search(nums: number[], target: number): number {
    const n = nums.length;
    let left = 0, right = n - 1;

    // 1. 寻找旋转点（最小值索引）
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] > nums[right]) {
            left = mid + 1;       // 最小值在右半部分
        } else {
            right = mid;          // 最小值在左半部分（含 mid）
        }
    }
    const pivot = left; // 最小值索引

    // 2. 在有序区间内二分查找
    const binarySearch = (l: number, r: number): number => {
        while (l <= r) {
            const mid = Math.floor((l + r) / 2);
            if (nums[mid] === target) return mid;
            if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return -1;
    };

    // 3. 根据 target 与最后一个元素的大小决定在哪个有序部分查找
    if (target > nums[n - 1]) {
        // target 在左侧较大有序部分（如果存在）
        return binarySearch(0, pivot - 1);
    } else {
        // target 在右侧较小有序部分（或整个数组未旋转时）
        return binarySearch(pivot, n - 1);
    }
}