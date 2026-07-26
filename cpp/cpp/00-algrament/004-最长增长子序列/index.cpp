#include <vector>
using namespace std;

class Solution
{
public:
    int lengthOfLIS(vector<int> &nums)
    {
        if (nums.empty())
            return 0;
        int n = nums.size();
        vector<int> memroy(n, 1);
        int maxSize = 1;
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < i; j++)
            {
                if (nums[i] <= nums[j])
                    continue;

                if ((memroy[j] + 1) > memroy[i])
                    memroy[i] = memroy[j] + 1;
            }
            maxSize = max(maxSize,memroy[i]);
        }
        return maxSize;
    };
};