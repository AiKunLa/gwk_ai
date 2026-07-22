#include <iostream>
using namespace std;

class Line
{
public:
    Line(double len)
    {
        cout << "Start--------" << endl;
    }
    ~Line()
    {
        cout << "End-------" << endl;
    }
    void doSomething()
    {
        cout << "It is working" << endl;
    }
};

int main()
{
    cout << "Main working---" << endl;
    {
        cout << ">>> 2. 进入内部作用域" << endl;

        Line myLine(10.0); // ⑥ 对象在这里【出生】（调用构造）

        myLine.doSomething(); // ⑦ 对象【活着】执行任务

        cout << ">>> 3. 即将离开内部作用域" << endl;
    }
    cout << ">>> 4. 已经离开内部作用域，对象已死，无法再使用" << endl;

    return 0;
}