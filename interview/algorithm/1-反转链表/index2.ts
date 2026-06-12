class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined) ? 0 : val
        this.next = (next === undefined) ? null : next
    }
}


function reverseBetween(head: ListNode | null, left: number, right: number): ListNode | null {
    // 先把要反转那一块的给截取出来，并记录前置节点和尾部节点
    // 反正截取链表 再拼接进去即可
    const dummy = new ListNode(0, head);
    let p0 = dummy;
    for (let i = 0; i < left - 1; i++) {
        p0 = p0.next!;
    }

    let pre = null
    let cur = p0.next
    for (let i = 0; i < right - left + 1; i++) {
        const next = cur?.next
        cur!.next = pre
        pre = cur
        cur = next!
    }

    // 将反转区域的尾节点 接入右边节点
    p0.next!.next = cur;
    // 将左边接入反转区域头节点
    p0.next = pre;
    return dummy.next;
};

