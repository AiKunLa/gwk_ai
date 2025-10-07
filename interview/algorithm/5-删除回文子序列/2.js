//给你一个字符串 s，它仅由字母 'a' 和 'b' 组成。每一次删除操作都可以从 s 中删除一个回文 子序列。
//返回删除给定字符串中所有字符（字符串为空）的最小删除次数。

function minDeletionsToEmpty(s) {
    let left = 0, right = s.length - 1
    let count = 1
    const isPal = (s,left,right) => {
        while(left < right) {
            if(s[left] !== s[right]) {
                return false
            }
            left++
            right--
        }
        return true
    }
    while(left < right) {
        if(s[left] === s[right]) {
            left++
            right--
        }else {
            // 若left+1 到right 和 left到right-1 不为回文，则count+2
            // 若left+1 到right 或 left到right-1 为回文，则count+1
            if(isPal(s,left+1,right) || isPal(s,left,right-1)) {
                count++
                break
            }else {
                count += 2
                left++
                right--
            }
        }
    }
    return count
}
       
console.log(minDeletionsToEmpty("ababa")); //1
console.log(minDeletionsToEmpty("abb")); //2
console.log(minDeletionsToEmpty("baab")); //1
console.log(minDeletionsToEmpty("abba")); //1
console.log(minDeletionsToEmpty("ababab")); //2
console.log(minDeletionsToEmpty("abababab")); //2
console.log(minDeletionsToEmpty("ababababab")); //2
console.log(minDeletionsToEmpty("ababb")); //


function removePalindromeSub(s) {
    let left = 0, right = s.length - 1
    while(left < right) {
        if(s[left] === s[right]) {
            left++
            right--
        }else {
            return 2
        }
    }
    return 1
}