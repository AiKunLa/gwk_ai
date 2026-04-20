

function calcEquation(equations: string[][], values: number[], queries: string[][]): number[] {
    // 使用带权邻接表来构建图，然后使用dfs或bfs进行节点查找
    const map: Map<string, Map<string, number>> = new Map()
    const res: number[] = []

    // 构建图
    for (let i = 0; i < equations.length; i++) {
        const [a, b] = equations[i]

        if (!map.has(a)) {
            map.set(a, new Map())
        }
        if (!map.has(b)) {
            map.set(b, new Map())
        }

        map.get(a)!.set(b, values[i])
        map.get(b)!.set(a, 1 / values[i])
    }

    // 首尾
    const dfs = (head: string, tail: string, visited: Set<string> = new Set()): number | null => {
        if (head === tail) return 1  // 找到目标
        if (visited.has(head)) return null  // 防环
        visited.add(head)

        const currentList = map.get(head)
        if (!currentList) return null

        if (currentList.has(tail)) return currentList.get(tail) as number

        for (const [key, currentValue] of currentList) {
            const value = dfs(key, tail, visited)
            if (value !== null) return currentValue * value
        }
        return null
    }

    for (const [a, b] of queries) {
        if (!map.has(a) || !map.has(b)) {
            res.push(-1)
            continue
        }
        const value = dfs(a, b)
        if (!value) res.push(-1)
        else res.push(value)
    }

    return res
};