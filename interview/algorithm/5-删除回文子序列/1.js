// 这个函数的作用是：判断给定的字符串 s 是否可以通过至多删除一个字符变成回文字符串。
// 换句话说，允许删除最多一个字符，判断剩下的字符串是否为回文。
function validPalindrome(s) {
    let left = 0, right = s.length - 1

    /**
     * 判断子串 s[i...j] 是否为回文串
     * @param {string} s - 输入字符串
     * @param {number} i - 左指针
     * @param {number} j - 右指针
     * @returns {boolean} - 是否为回文
     */
    const isPal = (s, i, j) => {
        while (i < j) {
            if (s[i] !== s[j]) {
                return false;
            }
            i++;
            j--;
        }
        return true;
    };

    while (left < right) {
        if (s[left] === s[right]) {
            left++;
            right--;
        } else {
            // 删除左边或右边的一个字符后，判断剩下的子串是否为回文
            return isPal(s, left + 1, right) || isPal(s, left, right - 1);
        }
    }
    // 如果本身就是回文，直接返回 true
    return true;
}

// 测试用例
console.log(validPalindrome("abca")); // 输出 true