
class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.next = (next === undefined ? null : next)
    }
}

function deleteDuplicates(head: ListNode | null): ListNode | null {
    // 遍历链表 使用一个数curNUm记录当前遍历的val，若下一个结点的val与上一个相等，则之间往下继续遍历找到一个与val不相等的，然后
    // 将curNum记录为这个数， 若curNode.val != curNode.next.val 则将cunNode加入新的
    if (!head || !head.next) return head
    const newHead: ListNode | null = new ListNode(0, head)
    let p = newHead
    while (p.next && p.next.next) {
        let val = p.next.val
        // 存在重复
        if (p.next.next.val == val) {
            // 往后跳
            while (p.next && p.next.val === val) {
                p.next = p.next.next
            }
        } else {
            p = p.next
        }
    }
    return newHead.next
};