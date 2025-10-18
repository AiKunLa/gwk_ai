/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function (text1, text2) {
  const m = text1.length;
  const n = text2.length;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  let maxLength = 0;
  let endIndex = 0;

  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
        
    }
  }
};
