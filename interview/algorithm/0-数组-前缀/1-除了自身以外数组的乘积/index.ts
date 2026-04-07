function productExceptSelf(nums: number[]): number[] {
    const len = nums.length
    const answer = new Array(len).fill(0)

    const L = new Array(len).fill(0)
    const R = new Array(len).fill(0)

    let l = 0, r = len - 1
    while (l < len && r >= 0) {
        if (l === 0) L[l] = 1
        else {
            L[l] = L[l - 1] * nums[l - 1]
        }
        if (r === len - 1) R[len - 1] = 1
        else {
            R[r] = R[r + 1] * nums[r + 1]
        }
        l++
        r--
    }

    for (let i = 0; i < len; i++) {
        answer[i] = L[i] * R[i]
    }

    return answer
};


function productExceptSelf2(nums: number[]): number[] {
    const result: number[] = new Array(nums.length)
    result[0] = 1
    for (let i = 1; i < nums.length; i++) {
        result[i] = result[i - 1] * nums[i - 1]
    }

    // 存储当前数的右边的乘积
    let right = 1
    for (let i = nums.length - 1; i >= 0; i--) {
        result[i] = result[i] * right
        right = right * nums[i]
    }
    return result
}