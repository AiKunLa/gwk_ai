# js考题之为什么要有变量
 - 查询中声明变量，给程序带来了状态、
 - 变量是对内存中数据的抽象，他提供了可读、可写、可复用的方式来操作内存中值  程序：（数据+逻辑状态）
 - 变量的本质是对一块内存地址的引用。

 - js里变量的类型由什么决定？
 - js基本数据类型：number、string、boolean、undefined、null、symbol、bigInt
  - String ：
  - Number：
  - Boolean：
  - Undefined：为定义的变量（），值为undefined
  - Null：空（表示有定义有值但是值为空），如：字符串长度为0，数组长度为0，对象没有属性，函数没有参数
  - Symbol：它创建的是独一无二且不可变的值，常被用作对象属性的键以避免命名冲突

# js考题之const arr = [1,2,3,4,5]中arr是什么数据类型？
 - 数组
 - arr是一个引用类型，指向一个数组对象。
 - 

# js必考api  切割字符串、数组

# js声明变量
 - let num = 1; var num2 = 5;
 - // es6 推出了全新的let 2015年推出了es6
 - var 的缺点 变量提升 函数提升， 在声明之前被调用
 - if(false){var value = 1;}
 - console.log(value) //undefined 代表value是全局变量，但是我们并没有声明这个全局变量，变量在未声明之前被调用（变量提升）

 - if(false){let value = 1;} //局部声明  let 不存在变量提升 
 - console.log(value) // 全局作用域
# 变量和常量之间的区别