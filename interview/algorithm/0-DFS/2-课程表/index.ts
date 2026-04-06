function canFinish(numCourses: number, prerequisites: number[][]): boolean {
    const graph: number[][] = Array.from({ length: numCourses }, () => [])
    for (const [course, preCourse] of prerequisites) {
        graph[preCourse].push(course)
    }
    
    // 0: 未访问, 1: 递归栈中, 2: 已完成
    const state: number[] = new Array(numCourses).fill(0)

    function hasCycle(index: number): boolean {
        if (state[index] === 1) return true  // 环检测
        if (state[index] === 2) return false // 已检查过
        
        state[index] = 1 // 标记为"在递归栈中"
        for (const next of graph[index]) {
            if (hasCycle(next)) return true
        }
        state[index] = 2 // 回溯时标记为"已完成"
        return false
    }

    for (let i = 0; i < numCourses; i++) {
        if (state[i] === 0 && hasCycle(i)) return false
    }
    return true
};
