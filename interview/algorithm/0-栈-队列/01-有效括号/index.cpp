#include <string>
#include <stack>
using namespace std;
class Solution
{
public:
    bool isValid(string s)
    {
        // 使用栈来进行检查，遇到左括号入栈，遇到右括号则就出栈，然后比较这个出栈的和当前的括号是否能匹配
        // 能匹配则就继续检查下一个即可，不匹配则就retren false
        stack<char> st;
        for (char c : s)
        {
            if (c == '(' || c == '{' || c == '[')
            {
                st.push(c);
            }
            else
            {
                if (st.empty())
                {
                    return false;
                }
                else
                {
                    char top = st.top();
                    st.pop();
                    if ((c==')'&& top != '(') || (c==']'&&top!='[')||(c=='}'&&top!='{')){
                        return false;
                    }
                }
            }
        }
        // 这里判断栈是否为空，如果为空说明所有的括号都匹配成功，返回true，否则返回false
        return st.empty();
    }
};