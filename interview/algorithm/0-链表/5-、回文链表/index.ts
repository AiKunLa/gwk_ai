class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.next = (next === undefined ? null : next)
    }
}


function isPalindrome(head: ListNode | null): boolean {
    let fast: ListNode | null = head
    let low: ListNode | null = head
    while (fast && fast.next) {
        low = low?.next
        fast = fast.next.next
    }

    let pre: ListNode | null = null
    let cur: ListNode | null = low

    while (cur) {
        const tempNode = cur.next
        cur.next = pre
        pre = cur
        cur = tempNode
    }

    let right: ListNode | null = pre
    let left: ListNode | null = head
    while (right) {
        if (right.val !== left?.val) return false
        right = right.next
        left = left.next
    }

    return true

}