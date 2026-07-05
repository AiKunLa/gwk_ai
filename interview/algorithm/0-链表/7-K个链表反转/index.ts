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
        this.val = (val === undefined) ? 0 : val
        this.next = (next === undefined) ? null : next
    }
}

function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
    // 使用双指针，前一个指针向后遍历K个位置，之后的节点个数小于K则结束，遍历到K个位置之后以这个节点作为反转的终点，以此为一个循环，知道节点个数小于K
    // 统计节点个数，以K个节点为一组来处理

    let count = 0, p = head
    while (p) {
        count++
        p = p.next
    }
    if (count < k) return head

    const dummy = new ListNode(0, head)
    let p0 = dummy
    let pre = null
    let cur = head

    while (count >= k) {
        for (let i = 0; i < k; i++) {
            const next = cur.next
            cur.next = pre
            pre = cur
            cur = next
        }

        const tail = p0.next // 
        p0.next.next = cur
        p0.next = pre
        p0 = tail
        count -= k
    }
    return dummy.next

}

