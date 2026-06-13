class LRUNode {
    key: number
    val: number
    pre: LRUNode | null
    next: LRUNode | null
    constructor(key?: number, val?: number) {
        this.key = (key === undefined) ? 0 : key
        this.val = (val === undefined) ? 0 : val
        this.pre = null
        this.next = null
    }
}


class LRUCache {
    // 最大缓存数量
    private capacity: number
    // Map 存储
    private storeMap: Map<number, LRUNode>
    // 头尾节点
    private head: LRUNode
    private tail: LRUNode
    constructor(capacity: number) {
        this.capacity = capacity
        this.storeMap = new Map()
        this.head = new LRUNode()
        this.tail = new LRUNode()
        this.head.next = this.tail
        this.tail.pre = this.head
    }

    /**
     * 删除节点
     * @param node 
     */
    private deleteNode(node: LRUNode) {
        node.pre!.next = node.next
        node.next!.pre = node.pre
    }

    private addNodeToHead(node: LRUNode) {
        node.next = this.head.next
        node.pre = this.head
        this.head.next!.pre = node
        this.head.next = node
    }

    get(key: number): number {
        if (!this.storeMap.has(key)) return -1
        const node = this.storeMap.get(key)!
        this.deleteNode(node)
        this.addNodeToHead(node)
        return node.val
    }

    put(key: number, val: number): void {
        if (this.storeMap.has(key)) {
            const node = this.storeMap.get(key)!
            node.val = val
            this.deleteNode(node)
            this.addNodeToHead(node)
        } else {
            // 没有
            const node = new LRUNode(key, val)
            this.storeMap.set(key, node)
            this.addNodeToHead(node)
            if (this.storeMap.size > this.capacity) {
                const tailPre = this.tail.pre!
                this.deleteNode(tailPre)
                this.storeMap.delete(tailPre.key)
            }
        }
    }

}