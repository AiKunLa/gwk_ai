/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */
class ListNode {
    val: number
    next: ListNode | null
    constructor(val: number, next: ListNode | null) {
        this.val = val
        this.next = next
    }
}

function hasCycle(head: ListNode | null): boolean {
    // 快慢指针
    let fast = head, slow = head
    // 当fast 指向null的时候返回true
    while (fast !== null) {
        slow = slow!.next
        fast = fast.next
        if (fast) fast = fast.next
        if (fast !== null && fast === slow) return true
    }
    return false
};