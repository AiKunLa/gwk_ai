

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

    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.next = (next === undefined ? null : next)
    }

}


function reverseList(head: ListNode | null): ListNode | null {
    // 使用前插法
    if (!head || !head.next) return head
    const pre = new ListNode()
    let p = head
    let q = p
    while (p) {
        q = p.next
        p.next = head.next
        pre.next = p
        p = q
    }
    return pre.next
};



function reverseList(head: ListNode | null): ListNode | null {
    if (!head || !head.next) return head

    const pre = new ListNode()
    let cur: ListNode | null = head
    let next: ListNode | null = null
    while (cur) {
        next = cur.next
        cur.next = pre.next
        pre.next = cur
        cur = next
    }
    return pre.next
}