function longestPalindrome(s: string): string {
    // 中心拓展方法
    // 遍历字符以每个字符为中心向两侧进行拓展，知道s[l] !== s[r],这段回味字符串的长度就是 r-l-1
    // 奇数回文和偶数回文要分情况，奇数回文就直接i=i，偶数则就i ， i+1
    if (s.length < 2) return s
    const n = s.length
    let maxLen = 0
    let start = 0

    const exportFromCenter = (left: number, right: number): number => {
        // 以这俩个下标为起始向两侧进行拓展
        while (left >= 0 && right < n && s[left] === s[right]) {
            left--
            right++
        }
        return right - left - 1
    }

    for (let i = 0; i < n; i++) {
        // 奇数
        const len1 = exportFromCenter(i, i)
        // 偶数
        const len2 = exportFromCenter(i, i + 1)
        const curMax = Math.max(len1, len2)
        if (curMax > maxLen) {
            maxLen = curMax
            start = i - Math.floor((maxLen - 1) / 2)
        }
    }

    return s.substring(start, start + maxLen)

}