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

function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    //双指针遍历 创建一个新的链表 对于每个节点的值为 l1 + l2 + 之前的进位
    const head = new ListNode()
    let p = head, node1 = l1, node2 = l2, pre = 0
    while (node1 || node2 || pre) {
        let val = pre
        if (node1) {
            val += node1.val
            node1 = node1.next
        }
        if (node2) {
            val += node2.val
            node2 = node2.next
        }
        pre = Math.floor(val / 10)
        const node = new ListNode(val % 10)
        p.next = node
        p = node
    }
    return head.next
};