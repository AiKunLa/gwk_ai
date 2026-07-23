
struct ListNode
{
    /* data */
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {};
    ListNode(int x) : val(x), next(nullptr) {};
    ListNode(int x, ListNode *next) : val(x), next(next) {};
};

class Solution
{
public:
    ListNode *reverseBetween(ListNode *head, int left, int right)
    {
        // 先找到要截取的那一块的头节点
        ListNode dumy(0);
        dumy.next = head;

        // 让p0指向left前一个节点
        ListNode *p0 = &dumy;
        for (int i = 0; i < left - 1; i++)
        {
            p0 = p0->next;
        }

        ListNode *pre = nullptr;
        ListNode *cur = p0->next;
        for (int i = 0; i <= right - left; i++)
        {
            ListNode *next = cur->next;
            cur->next = pre;
            pre = cur;
            cur = next;
        }

        // 头尾链接
        p0->next->next = cur;
        p0->next = pre;
        return dumy.next;
    };
};
