function wordBreak(s: string, wordDict: string[]): boolean {
    // dp[i]为true 表示字符串s[0,i]可以被拆成wordDirct中的单词
    // 状态转移方程，若在i的前面找到一个dp[j]为true，s[j,i]在wordDict中可以被找到 则dp[i]为true 否则为false
    const dp: boolean[] = new Array(s.length + 1).fill(false)
    const wordSet: Set<string> = new Set(wordDict)
    dp[0] = true
    for (let i = 1; i <= s.length; i++) {
        for (let j = 0; j <= i; j++) {
            if (dp[j] === true && wordSet.has(s.substring(j, i))) {
                dp[i] = true
                break
            }
        }
    }

    return dp[s.length]
};