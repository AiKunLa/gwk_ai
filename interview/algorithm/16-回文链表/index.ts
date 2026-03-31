class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.next = (next === undefined ? null : next)
    }
}

function isPalindrome(head: ListNode | null): boolean {
    if (!head) return true

    // 使用快慢指针来找到中间节点
    let slow: ListNode | null = head
    let fast: ListNode | null = head

    while (fast && fast.next) {
        slow = slow?.next
        fast = fast.next.next
    }

    // 反转后半部分链表
    let prev: ListNode | null = null
    let curr: ListNode | null = slow

    while (curr) {
        const nextTemp: ListNode | null = curr.next
        curr.next = prev
        prev = curr
        curr = nextTemp
    }

    // 比较前半部分和反转后的后半部分
    let left: ListNode | null = head
    let right: ListNode | null = prev

    while (right) {
        if (left?.val !== right.val) return false
        left = left?.next
        right = right.next
    }
    return true
}