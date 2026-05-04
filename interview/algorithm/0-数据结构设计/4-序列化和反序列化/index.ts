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


/*
 * Encodes a tree to a single string.
 */
function serialize(root: TreeNode | null): string {
    // 先序遍历节点，并进行字符串拼接，若为节点为null则拼接#
    const vals: string[] = [];
    const dfs = (node: TreeNode | null): void => {
        if (!node) {
            vals.push("#")
            return
        }
        vals.push(String(node.val))
        dfs(node.left);
        dfs(node.right);
    }
    dfs(root)
    return vals.join(',')
};

/*
 * Decodes your encoded data to tree.
 */
function deserialize(data: string): TreeNode | null {
    if (!data) return null
    const vals: string[] = data.split(',')
    let index = 0

    const dfs = (): TreeNode | null => {
        if (vals[index] === '#') {
            index++
            return null
        }
        const node = new TreeNode(parseInt(vals[index]))
        index++
        node.left = dfs()
        node.right = dfs()
        return node
    }
    return dfs()
};


/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */