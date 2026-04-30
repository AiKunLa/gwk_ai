
class TreeNode {
    val: number
    left: TreeNode | null
    right: TreeNode | null
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.right = (right === undefined ? null : right)
        this.left = (left === undefined ? null : left)
    }
}

function diameterOfBinaryTree(root: TreeNode | null): number {
    // 比较每个节点 最大左子树深度加最大右子树深度 即可，选最大的

    if (!root) return 0
    let maxCir = 0
    // 获取树的深度
    const deep = (node: TreeNode | null): number => {
        if (!node) return -1

        const lLen = deep(node.left) + 1; // 左子树最大链长+1
        const rLen = deep(node.right) + 1; // 右子树最大链长+1
        maxCir = Math.max(maxCir, lLen + rLen); // 两条链拼成路径
        return Math.max(lLen, rLen); // 当前子树最大链长
    }
    deep(root)
    return maxCir
};