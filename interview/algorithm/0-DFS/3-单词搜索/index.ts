function exist(board: string[][], word: string): boolean {
    const n = board.length, m = board[0].length
    // const visted: boolean[][] = Array.from({ length: n }, () => Array(m).fill(false))
    const dfs = (i: number, j: number, k: number) => {
        if (board[i][j] !== word[k]) {
            return false
        }
        if (k + 1 === word.length) {
            return true
        }

        // 标记为访问过
        board[i][j] = '0'
        for (const [x, y] of [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]]) {
            if (x >= 0 && x < n && y >= 0 && y < m && dfs(x, y, k + 1)) {
                return true
            }
        }
        board[i][j] = word[k]
        return false
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (dfs(i, j, 0)) return true
        }
    }
    return false
};

var exist = function(board, word) {
    const cnt = new Map();
    for (const row of board) {
        for (const c of row) {
            cnt.set(c, (cnt.get(c) ?? 0) + 1);
        }
    }

    // 优化一
    const wordCnt = new Map();
    for (const c of word) {
        wordCnt.set(c, (wordCnt.get(c) ?? 0) + 1);
        if (wordCnt.get(c) > (cnt.get(c) ?? 0)) {
            return false;
        }
    }

    // 优化二
    if ((cnt.get(word[word.length - 1]) ?? 0) < (cnt.get(word[0]) ?? 0)) {
        word = word.split('').reverse();
    }

    const m = board.length, n = board[0].length;
    function dfs(i, j, k) {
        if (board[i][j] !== word[k]) {
            return false; // 匹配失败
        }
        if (k + 1 === word.length) {
            return true; // 匹配成功！
        }
        board[i][j] = 0; // 标记访问过
        for (const [x, y] of [[i, j - 1], [i, j + 1], [i - 1, j], [i + 1, j]]) { // 相邻格子
            if (0 <= x && x < m && 0 <= y && y < n && dfs(x, y, k + 1)) {
                return true; // 搜到了！
            }
        }
        board[i][j] = word[k]; // 恢复现场
        return false; // 没搜到
    }
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (dfs(i, j, 0)) {
                return true; // 搜到了！
            }
        }
    }
    return false; // 没搜到
};
