function countSmaller(nums) {
    // 遍历两遍数组，第一次将元素以key ： {} 的形式存入map中
    // 第二次，通过parentid找寻父节点，并存入父节点的 {} 中去

    const map = new Map()
    const result = []

    const ID = "id"
    const PID = 'parentid'
    const CHILDREN = "children"

    for (const item of nums) {
        const id = item[ID]
        const pid = item[PID]

        const node = map.get(id)
        if (!node) {
            node = { ...item, [CHILDREN]: [] }
            map.set(id, node)
        } else {
            Object.assign(node, item)
            if (!node[CHILDREN]) {
                node[CHILDREN] = []
            }
        }

        if (pid == null || pid === 0) {
            result.push(node)
        } else {
            let pNode = map.get(pid)
            if (!pNode) {
                pNode = { [ID]: pid, [CHILDREN]: [] }
                map.set(pid, pNode)
            }
            pNode[CHILDREN].push(node);
        }

    }
    return result
}
