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

function rob(root: TreeNode | null): number {
    // 使用层序遍历计算每一层的总金额 放入到一个数组当中去，然后使用1的方式来解决，动态规划
    const loodp = (root: TreeNode | null): number[] => {
        if (!root) return []
        const queue: TreeNode[] = [root]
        const res: number[] = []
        while (queue.length > 0) {
            const leveLSize = queue.length
            let levelSum = 0
            for (let i = 0; i < leveLSize; i++) {
                const node = queue.shift()!
                levelSum += node.val
                if (node.left) queue.push(node.left)
                if (node.right) queue.push(node.right)
            }
            res.push(levelSum)
        }
        return res
    }

    const nums = loodp(root)

    const dp: number[] = new Array(nums.length).fill(0)
    let max = nums[0], preMax = 0
    dp[0] = nums[0]
    for (let i = 1; i < nums.length; i++) {
        dp[i] = preMax + nums[i]
        preMax = preMax < dp[i - 1] ? dp[i - 1] : preMax
        max = max < dp[i] ? dp[i] : max
    }
    return max
};


function rob(root: TreeNode | null): number {
    const dp = (root: TreeNode | null): number[] => {
        if (!root) return [0, 0]

        const [lnodeVal, lnotLNodeV] = dp(root.left)
        const [rnodeVal, rnotRNodev] = dp(root.right)

        let curNodeVal = lnotLNodeV + rnotRNodev + root.val
        let notCurNodeValue = Math.max(lnodeVal, lnotLNodeV) + Math.max(rnodeVal, rnotRNodev)
        return [curNodeVal, notCurNodeValue]
    }
    return Math.max(...dp(root))
}