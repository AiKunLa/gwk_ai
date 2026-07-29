#include <vector>
using namespace std;
class Solution
{
    // 四个数组分别代表四个行走方向，右、下、左、上
    static constexpr int DIRS[4][2] = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}}; // 右下左上
public:
    vector<int> spiralOrder(vector<vector<int>> &matrix)
    {
        // 右边挡住了就往下，下边挡住了就向左，左边挡住了就往上，上边-》右边
        int m = matrix.size(), n = matrix[0].size();
        vector<int> sotre(m * n);

        // 遍历 n*m
        int i = 0, j = 0, di = 0;
        for (int k = 0; k < m * n; k++)
        {
            // 放入结果集合
            sotre[k] = matrix[i][j];
            // 将遍历过的进行标记
            matrix[i][j] = __INT_MAX__;
            // 按照之前的方向行走后的下一步
            int x = i + DIRS[di][0];
            int y = j + DIRS[di][1];
            // 若下一步超出了范围则改变方向
            if (x < 0 || x >= m || y < 0 || y >= n || matrix[x][y] == __INT_MAX__)
            {
                // 方向改变
                di = (di + 1) % 4;
            }
            // 方向改变后的下一步
            i += DIRS[di][0];
            j += DIRS[di][1];
        }
        return sotre;
    }
};