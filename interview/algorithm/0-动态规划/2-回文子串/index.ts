

function countSubstrings(s: string): number {
    const expand_around_center = (i: number, j: number): number => {
        let count = 0
        while (i >= 0 && j < s.length && s[i] === s[j]) {
            count++
            i--
            j++
        }
        return count
    }

    let total = 0
    /**
     * 由中心向两边扩展，分为奇数和偶数长度
     */
    for (let i = 0; i < s.length; i++) {
        total += expand_around_center(i, i)
        total += expand_around_center(i, i + 1)
    }
    return total
};

function isSubstring(s: string): boolean {
    let l = 0, r = s.length - 1
    while (l < r) {
        if (s[l] !== s[r]) return false
    }
    return true
}