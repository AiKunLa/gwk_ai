class LRUNode  {
    key: number;
    val: number;
    pre: LRUNode  | null;
    next: LRUNode | null;
    constructor(key: number = 0, val: number = 0) {
        this.key = key
        this.val = val
        this.pre = null
        this.next = null
    }
}

class LRUCache {
    private capacity: number
    private cashMap: Map<number, LRUNode>
    private head: LRUNode
    private tail: LRUNode
    constructor(capacity: number) {
        this.capacity = capacity
        this.cashMap = new Map<number, LRUNode>()
        this.head = new LRUNode()
        this.tail = new LRUNode()
        this.head.next = this.tail
        this.tail.pre = this.head
    }

    private addToHead(node: LRUNode): void {
        node.pre = this.head
        node.next = this.head.next
        this.head.next!.pre = node
        this.head.next = node
    }

    private deleteNode(node: LRUNode): void {
        node.pre!.next = node.next
        node.next!.pre = node.pre
    }

    get(key: number): number {
        if (!this.cashMap.has(key)) return -1
        const node = this.cashMap.get(key)!
        this.deleteNode(node)
        this.addToHead(node)
        return node.val
    }


    put(key: number, value: number): void {
        // 若已经存在了修改 value
        if (this.cashMap.has(key)) {
            const node = this.cashMap.get(key) as LRUNode
            node!.val = value
            this.deleteNode(node)
            this.addToHead(node)
        } else {
            // 处理新节点
            // 判断是否超出容量
            const newNode = new LRUNode(key, value)
            this.cashMap.set(key, newNode)
            // 在头节点后中插入节点
            this.addToHead(newNode)

            if (this.cashMap.size > this.capacity) {
                const tailPre = this.tail.pre!
                this.cashMap.delete(tailPre.key)
                this.deleteNode(tailPre)
            }

        }
    }

}

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */