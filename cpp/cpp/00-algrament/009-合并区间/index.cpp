#include "vector"

using namespace std;

class Solution
{
public:
    vector<vector<int>> merge(vector<vector<int>> &intervals)
    {
        // 排序，按照区间的第一个来升序排序
        // 遍历每个区间，比较当前区间第一个数是否在收集区间内部，若在则并将尾部，那个尾部大那个就是新尾部
        if (intervals.empty())
            return {};

        sort(intervals.begin(), intervals.end(), [](const vector<int> &a, const vector<int> &b)
             { return a[0] < b[0]; });
        vector<vector<int>> merge;
        merge.push_back(intervals[0]);
        for (int i = 1; i < intervals.size(); i++)
        {
            if (intervals[i][0] <= merge.back()[1])
            {
                merge.back()[1] = max(merge.back()[1], intervals[i][1]);
            }
            else
            {
                merge.push_back(intervals[i]);
            }
        }
        return merge;
    }
};