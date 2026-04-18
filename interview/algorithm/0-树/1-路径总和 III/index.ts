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
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.left = (left === undefined ? null : left)
        this.right = (right === undefined ? null : right)
    }
}

/**
 * 从根节点遍历到当前节点，要找到和为targetSum的路径，需要在历史前缀和中查找到currentPre - tragetSum出现了多少次
 * preNumberCount 用于记录前缀和的数量
 * dfs遍历整个树，以当前遍历节点为终止节点，计算tragetPre = currentPre - tragetSum，并去map中寻找targetPre出现的次数，累加到结果上
 * 遍历完该节点之后回溯即可
 * @param root 
 * @param targetSum 
 * @returns 
 */
function pathSum(root: TreeNode | null, targetSum: number): number {
    const preNumberCount: Map<number, number> = new Map()
    preNumberCount.set(0, 1)
    let head = root
    let count = 0
    const dfs = (node: TreeNode | null, pre: number) => {
        if (!node) return
        // 当前的前缀 - 减去target = pre，找map中的pre的个数
        let currentPre = pre + node.val
        let tragetPre = currentPre - targetSum
        if (preNumberCount.has(tragetPre)) {
            count += preNumberCount.get(tragetPre)!
        }
        if (preNumberCount.has(currentPre)) {
            preNumberCount.set(currentPre, preNumberCount.get(currentPre)! + 1)
        } else {
            preNumberCount.set(currentPre, 1)
        }
        dfs(node.left, currentPre)
        dfs(node.right, currentPre)
        preNumberCount.set(currentPre, preNumberCount.get(currentPre)! - 1)
    }
    dfs(head, 0)
    return count
};

