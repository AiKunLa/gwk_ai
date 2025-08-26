class LinkNode<T> {
    value : T;
    next : LinkNode<T> | null = null;  
    constructor(value:T) {
        this.value = value
    }
}

const pre = new LinkNode<string>('小明')
pre.next = new LinkNode<string>('tiantain')

class LinkList<T> {
    head:LinkNode<T> | null = null
    append(value:T):void {
        const newNode = new LinkNode(value)
        if(!this.head) {
            this.head = newNode
            return
        }
        let current = this.head
        while(current.next) {
            current = current.next
        }
        current.next = newNode
    }
}

interface User {
    name:string
    age:number
}

// User类型的链表
const userList = new LinkList<User>()
userList.append({
    name:'xim',
    age:45
})
userList.append({
    name:'xiaf',
    age:99
})