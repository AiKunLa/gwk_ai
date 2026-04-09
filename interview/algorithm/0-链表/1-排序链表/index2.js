function merge(head1, head2) {
    const dummyHead = new ListNode(0);
    let temp = dummyHead, temp1 = head1, temp2 = head2;
    while (temp1 !== null && temp2 !== null) {
        if (temp1.val <= temp2.val) {
            temp.next = temp1;
            temp1 = temp1.next;
        } else {
            temp.next = temp2;
            temp2 = temp2.next;
        }
        temp = temp.next;
    }
    if (temp1 !== null) {
        temp.next = temp1;
    } else if (temp2 !== null) {
        temp.next = temp2;
    }
    return dummyHead.next;
}

function toSortList(start, end) {
    if (!start) return null

    // 当头尾相连的时候 断开形成独立的两个链表
    if (start.next === end) {
        start.next = null
        return start
    }

    let slow = start, fast = start
    while (fast !== end) {
        slow = slow.next
        fast = fast.next
        if (fast !== end) {
            fast = fast.next
        }
    }
    const mid = slow;
    return merge(toSortList(start, mid), toSortList(mid, end))
}
function sortList(head) {
    return toSortList(head, null)
}



