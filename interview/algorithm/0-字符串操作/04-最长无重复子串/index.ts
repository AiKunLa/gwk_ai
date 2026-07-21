function lengthOfLongestSubstring(s: string): number {
    // 滑动窗口
    // 使用一个Map来记录当前窗口内包含的字符以及对应的索引
    // 遍历字符串，若map种没有在set，若有则更改滑动窗口左侧位置
    const stroeMap: Map<string, number> = new Map()
    let leftIndex = 0
    let maxLen = 0

    for (let i = 0; i < s.length; i++) {
        const char = s[i]
        // 若当前字符在窗口内部，则将左边界移动到这个字符的后一个位置
        if (stroeMap.has(char)) {
            leftIndex = Math.max(leftIndex, stroeMap.get(char)! + 1)
        }
        // 更新
        stroeMap.set(char, i)
        maxLen = Math.max(maxLen, i - leftIndex + 1)
    }
    return maxLen
};