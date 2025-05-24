# 腾讯字符串考题
## 1. 字符串反转
- 如何实现字符串反向输出
- 输入：'hello'
- 输出：'olleh'

##  1. 题目很灵活，字符串反转的方法有很多，比如：
  - 1.1 利用js中数组的reverse方法，将字符串转换为数组反转后，然后再利用join转换为字符串
  str.split('').reverse().join('') 
   可以优化的点：
  - 1.2 简化的地方 使用函数表达式之 es6 箭头函数   使用箭头函数可以简化代码，并且箭头函数没有自己的this，所以不需要使用call方法，直接使用箭头函数即可
   const reverseString = (str) => str.split("").reverse().join("");
  - 箭头函数 于es5函数表达式
  - 1.3 省略function关键字，使用箭头。若只有一句代码，可以省略{}。若这句话是返回值则可以省略return
    

## 2. 字符串和数组上的方法  通过MDN文档查询AIP 

## 3. 'name'.split('') 
    -  简单数据类型没有split方法，但是可以使用.split()方法，因为js会自动将字符串转换为对象 这种方式称为隐式转换
    - js希望实现面向对象的统一写法，所以会自动将简单数据类型转换为对象，这种方式称为隐式转换，包装对象
    隐式转换的好处是：
    1. 代码简洁
    2. 避免了一些错误
    过程：包装对象->调用方法->返回值->销毁包装对象
    'hello'->new String('hello')

    数组对象
    ['h','e','l','l','o'].reverse().join('')

    3.1 包装类 ：js给所有简单数据类型提供都提供了一个包装类，例如String、Number、Boolean、Symbol、Null、Undefined 转换后就可以调用包装类的方法
        将简单数据类型包装为对象，实现统一的面向对象写法，用完后立即销毁
        不必向其他语言一样，既要函数是编程又要面向对象编程
        js 统一的面向对象写法
    - reverse 
    - join

## 4. == 和 === 的区别
    == 比较的是值，=== 比较的是值和类型    
    Object.prototype.toString.call('name') // [object String] 
    Object.prototype.toString.call(new String('name')) // [object String] 

## 模板字符串
- 字符串声明方式
 1.
  let str = "name";
 let str2 = `dangerous${str}`;

 
 