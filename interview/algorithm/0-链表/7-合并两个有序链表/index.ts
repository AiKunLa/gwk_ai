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

function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
    // 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 
    // 使用一个头节点作为前驱，同时遍历两个链表，那个小就讲这个节点接入尾部，指针向后移动一位即可，若一边的指针指向空，则结束
    let head = new ListNode(0, null)
    let p1 = list1, p2 = list2, p = head
    while (p1 && p2) {
        if (p1.val < p2.val) {
            p.next = p1
            p = p1
            p1 = p1.next
        } else {
            p.next = p2
            p = p2
            p1 = p2.next
        }
    }
    if (p1) p.next = p1
    if (p2) p.next = p2
    return head.next
};