#include <vector>
using namespace std;

class Solution
{
public:
    int maxProfit(vector<int> &prices)
    {
        // 使用一个数来记录最小值，遍历数组 计算当前的差额，比较当前的差值和计算出的差值，更新差值。更新最小直
        int result = 0;
        int min_price = prices[0];
        for (int p : prices)
        {
            result = max(result, p - min_price);
            min_price = min(min_price, p);
        };
        return result;
    }
};