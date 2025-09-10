// 迭代
function reverseList(head) {
  let pre = null;
  let cur = head;
  let next = null;
  while (cur) {
    next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}

// 递归法
/**
 * 使用递归方法反转链表
 * @param {ListNode} head - 待反转链表的头节点
 * @return {ListNode} 反转后链表的头节点
 */
function reverseList2(head) {
    // 递归终止条件：若链表为空或只有一个节点，直接返回该节点，因为空链表或单节点链表反转后还是自身
    if(head === null || head.next === null) {
        return head;
    }
    // 递归调用 reverseList2 函数，反转从当前节点的下一个节点开始的子链表，并获取反转后子链表的头节点
    const newHead = reverseList2(head.next)
    // 将当前节点的下一个节点的 next 指针指向当前节点，完成局部反转
    head.next.next = head;
    // 将当前节点的 next 指针置为 null，断开原有的连接，避免形成环
    head.next = null;
    // 返回反转后链表的头节点
    return newHead;
}



