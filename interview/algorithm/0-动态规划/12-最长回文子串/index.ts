
function longestPalindrome(s: string): string {
    // 找出最长回文子串
    // 遍历0~n-1，使用双指针向两边拓展，找到最大的回文字符串，这里要分奇偶
    // 奇数字符串和偶数字符串分开遍历即可
    // maxLeng =  r - l + 1 
    const n = s.length
    let resL = 0
    let resR = 0
    let maxLeng = 0

    // 奇数
    for (let i = 0; i < n; i++) {
        let l = i, r = i
        while (l >= 0 && r < n && s[l] === s[r]) {
            l--
            r++
        }
        if (r - l + 1 > maxLeng) {
            maxLeng = r - l + 1
            resL = l
            resR = r
        }
    }

    // 偶数
    for (let i = 0; i < n; i++) {
        let l = i, r = i + 1
        while (l >= 0 && r < n && s[l] === s[r]) {
            l--
            r++
        }
        if (r - l + 1 > maxLeng) {
            maxLeng = r - l + 1
            resL = l
            resR = r
        }
    }
    return s.substring(resL, resR + 1)
};



function longestPalindrome(s: string): string {
    if (s.length < 2) return s;
    
    let start = 0;
    let maxLen = 1;   // 至少一个字符

    // 中心扩展函数，返回扩展后的长度
    const expandAroundCenter = (left: number, right: number): number => {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        // 注意此时真实回文长度是 (right - 1) - (left + 1) + 1 = right - left - 1
        return right - left - 1;
    };

    for (let i = 0; i < s.length; i++) {
        // 奇数长度中心
        const len1 = expandAroundCenter(i, i);
        // 偶数长度中心
        const len2 = expandAroundCenter(i, i + 1);
        const curMax = Math.max(len1, len2);

        if (curMax > maxLen) {
            maxLen = curMax;
            // 根据长度反推起点：i 是中心，减去半长偏移
            start = i - Math.floor((curMax - 1) / 2);
        }
    }

    return s.substring(start, start + maxLen);
}