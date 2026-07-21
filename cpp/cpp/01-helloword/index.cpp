#include <iostream>

using namespace std;

int main()
{
   char str[] = "Hello C++";

   cout << "Value of str is : " << str << endl;
   cout << "number is five" << str << endl;

   cout << "number is six" << endl;

   cout << "what is your name" << "\n"
        << endl;
   cin >> str;
   cout << "your name is: " << str << endl;
   clog << "Error maessage " << str << endl;
   cerr << "Message log : " << str << endl;
}