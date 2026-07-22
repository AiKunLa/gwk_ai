#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> result;

    vector<vector<int>> permute(vector<int>& nums) {
        vector<int> path;
        vector<bool> used(nums.size(), false);
        backtrack(path, nums, used);

        return result;
    }

    void backtrack(vector<int>& path, vector<int>& nums, vector<bool>& used) {
        if (path.size() == nums.size()) {
            result.push_back(path);
            return;
        }
        for (int j = 0; j < nums.size(); j++) {
            if (used[j]) {
                continue;
            }
            used[j] = true;
            path.push_back(nums[j]);
            backtrack(path, nums, used);
            path.pop_back();
            used[j] = false;
        }
    }
};

class Solution2
{
private:
    vector<vector<int>> result;
    vector<int> path;

public:
    vector<vector<int>> permute(vector<int> &num)
    {
        vector<bool> used(num.size(), false);
        backtack(num, used);
        return result;
    };
    void backtack(vector<int> &nums, vector<bool> &used)
    {
        if (path.size() == nums.size())
        {
            result.push_back(path);
            return;
        }
        for (int i = 0; i < nums.size(); i++)
        {
            if (used[i])
                continue;
            path.push_back(nums[i]);
            used[i] = true;
            backtack(nums, used);
            used[i] = false;
            path.pop_back();
        };
    };
};
