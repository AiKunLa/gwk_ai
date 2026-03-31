/**
 * 给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null 。
 */

/**
 * Definition for singly-linked list.
 */
function ListNode(val) {
    this.val = val;
    this.next = null;
}

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {
    if (headA === null || headB === null) {
        return null
    }

    let pA = headA
    let pB = headB

    while (pA !== pB) {
        pA = pA !== null ? pA.next : headB
        pB = pB !== null ? pB.next : headA
    }

    if (pA === null) return null
    else return pA
}


// ========== 测试用例 ==========

// 辅助函数：打印链表
function printLink(head) {
    const arr = []
    while (head) {
        arr.push(head.val)
        head = head.next
    }
    console.log(arr.join(' -> ') || 'null')
}

// 测试1：相交情况
// listA = [4,1,8,4,5], skipA = 2 → 4 -> 1 -> (intersect) -> 8 -> 4 -> 5
// listB = [5,6,1,8,4,5], skipB = 3 → 5 -> 6 -> 1 -> (intersect) -> 8 -> 4 -> 5
function buildIntersectionList() {
    // 创建公共部分: 8 -> 4 -> 5
    const common = new ListNode(8)
    common.next = new ListNode(4)
    common.next.next = new ListNode(5)

    // 构建 A: 4 -> 1 -> common
    const headA = new ListNode(4)
    headA.next = new ListNode(1)
    headA.next.next = common

    // 构建 B: 5 -> 6 -> 1 -> common
    const headB = new ListNode(5)
    headB.next = new ListNode(6)
    headB.next.next = new ListNode(1)
    headB.next.next.next = common

    return { headA, headB, expectedVal: 8 }
}

console.log('--- 测试1: 相交情况 ---')
const { headA, headB, expectedVal } = buildIntersectionList()
console.log('listA:', printLink(headA))  // 4 -> 1 -> 8 -> 4 -> 5
console.log('listB:', printLink(headB))  // 5 -> 6 -> 1 -> 8 -> 4 -> 5

getIntersectionNode(headA, headB)  // 期望: Intersected at '8'
console.log(`预期结果: Intersected at '${expectedVal}'\n`)


// 测试2：不相交情况
function buildNoIntersectionList() {
    const headA = new ListNode(1)
    headA.next = new ListNode(2)
    headA.next.next = new ListNode(3)

    const headB = new ListNode(4)
    headB.next = new ListNode(5)
    headB.next.next = new ListNode(6)

    return { headA, headB }
}

console.log('--- 测试2: 不相交情况 ---')
const { headA: hA, headB: hB } = buildNoIntersectionList()
console.log('listA:', printLink(hA))  // 1 -> 2 -> 3
console.log('listB:', printLink(hB))  // 4 -> 5 -> 6

getIntersectionNode(hA, hB)  // 期望: No intersection
console.log('预期结果: No intersection\n')


// 测试3：空链表
console.log('--- 测试3: 空链表 ---')
getIntersectionNode(null, new ListNode(1))  // 期望: No intersection
console.log('预期结果: No intersection')
