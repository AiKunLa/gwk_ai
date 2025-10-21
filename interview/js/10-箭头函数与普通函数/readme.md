# 箭头函数和普通函数的区别

普通函数function
    - this 动态绑定，
    - argument对象
        argument的作用在于，由于函数的参数个数不固定
    - 可用于构造函数

箭头函数
    - 静态绑定 ，取决于定义的位置，继承外部作用域的this
    - 没有argument对象，使用reset运算符 ...args
    - 不能new，不能作为构造函数，这是应为他没有[Construct] 没有[prototype]
    - 只能提升申明，不能提升值
    - call、apply、bind不能改变this值，但是可以传参

性能方面： 箭头函数没有自己的作用域对象，调用时少一些绑定和开销，适合高频回调
