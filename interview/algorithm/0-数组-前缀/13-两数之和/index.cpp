#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution
{
public:
    vector<int> twoSum(vector<int> &nums, int target)
    {
        unordered_map<int, int> hash;
        for (int i = 0; i < nums.size(); i++)
        {
            int complement = target - nums[i];
            if (hash.find(complement) != hash.end())
            {
                return {hash[complement], i};
            }
            hash[nums[i]] = i;
        }
        return {};
    }
};

class Solution2 {
    
};


int main()
{
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    Solution sol;
    vector<int> result = sol.twoSum(nums, target);
    cout << "[" << result[0] << ", " << result[1] << "]" << endl;
    return 0;
}


