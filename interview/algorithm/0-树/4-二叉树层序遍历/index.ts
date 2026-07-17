/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

class TreeNode {
    val: number
    left: TreeNode | null
    right: TreeNode | null
    constructor(val?: number, right?: TreeNode | null, left?: TreeNode | null) {
        this.val = (val === undefined) ? 0 : val
        this.left = (left === undefined) ? null : left
        this.right = (right === undefined) ? null : right
    }
}

function levelOrder(root: TreeNode | null): number[][] {
    // 使用层序遍历 队列，首先根节点入队，用一个标记位置来记录下一层的最末尾的节点 初始时是根节点
    // 初始时跟根节点入队，标记节点为根节点，
    // 循环条件为队列不为空
    // 弹出队首节点 将其子节点入队
    // 若这个节点是末尾节点则 进入下一层
    if (!root) return []
    const result: number[][] = []
    const queue: TreeNode[] = [root]
    let col: number[] = []
    let lastNode: TreeNode = root
    let nextLast: TreeNode = root
    while (queue.length) {
        const node = queue.shift()!
        col.push(node?.val)

        if (node.left) {
            queue.push(node.left)
            nextLast = node.left
        }
        if (node.right) {
            queue.push(node.right)
            nextLast = node.right
        }
        if (node === lastNode) {
            result.push(col)
            col = []
            lastNode = nextLast
        }
    }
    return result
};
function levelOrder2(root: TreeNode | null): number[][] {
    // 一队列长度来进行遍历
    if (!root) return []
    const result: number[][] = []
    const queue: TreeNode[] = [root]
    while (queue.length) {
        const leveVal: number[] = []
        const n = queue.length
        for (let i = 0; i < n; i++) {
            const node = queue.shift()!
            leveVal.push(node?.val)
            if (node.left) queue.push(node.left)
            if (node.right) queue.push(node.right)
        }
        result.push(leveVal)
    }
    return result
}