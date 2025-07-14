# 函数
- 健壮性：
  - 输入参数类型检查：确保函数接收的参数类型是期望的，避免出现类型错误。
  - 输入参数范围检查：对输入参数进行范围检查，确保它们在函数期望的范围内。
  - 异常处理：在函数内部处理可能发生的异常情况，例如除以零、空指针等。
## 两数之和
Math是js中内置的一个对象，提供了一些数学常数和函数。
### typeof
- typeof是js中的一个运算符，用于判断变量的数据类型，并返回一个值是类型的字符串，表示变量的数据类型。
- typeof NaN === 'number' 的结果是 true，因为NaN是一个特殊的数字类型。
- NaN是JavaScript中表示“非数字”的特殊数值，虽名为“非数字”但仍属于number类型。 不是数字，但是是number类型的特殊值。
- 如何产生NaN：通常由 无效数值转换 （如字符串转数字失败）或 无效数学运算 （如 0/0）产生
虽然 NaN 表示“非数字”（Not a Number），但它在 JavaScript 中仍属于 number 类型的特殊值。 typeof 运算符检测的是数据的基本类型，而 NaN 本质上是数值类型的一种异常情况，因此 typeof NaN 会返回 "number" 。
- NaN === NaN 的结果是 false，因为 NaN 是一个特殊的数值，它与任何其他数值（包括自身）都不相等。 表示的是不是数字，但不是数字的方式有很多种
- 如何判断NaN：
  - 使用 isNaN() 函数：isNaN() 函数用于检查一个值是否为 NaN。

### 数据类型 
js有7种数据类型，分为基本数据类型和引用数据类型。 基本数据类型中有6种：包括：Numeric、String、Boolean、Undefined、Null、Symbol 其中Numeric 又分为Number和BigInt。 引用数据类型：包括：Object、Function、Array。
ECMA是JavaScript的标准化组织，它定义了JavaScript的标准
ECMA262 标准 定义了 7 种数据类型：

基本数据类型 primitive ：存在栈中，值直接存储在栈中，栈中存放的是值本身。
- 拷贝式传值： 
- Number与Bigint都属于Numeric类型，它们的区别在于：
 - 数值范围：Number 类型的数值范围是 -2^53 + 1 到 2^53 - 1，即 -9007199254740991 到 9007199254740991。

 - 数字（Number）：包括整数和浮点数，如 123、3.14。
 - 大整数（BigInt）：表示任意精度的整数。


- 字符串（String）：表示文本数据，如 "Hello"、"World"。
- 布尔值（Boolean）：表示真或假，只有两个值：true 和 false。
- 未定义（Undefined）：表示变量未被赋值，或变量已被声明但未初始化。
- 空值（Null）：表示空对象指针。
- 符号（Symbol）：表示唯一且不可变的数据类型。


引用数据类型 Reference：栈种存放地址，堆中存放具体值
- 对象（Object）：表示复杂的数据结构，如数组、对象等。
- 函数（Function）：表示可执行的代码块。
- 数组（Array）：表示有序的数据集合。

## Symbol
es6 新增了一种原始数据类型 Symbol，表示独一无二的值。
- 1. 为什么需要Symbol：
## 值传递机制
```javascript
// 基本类型拷贝
let a = 10;
let b = a;  // 值拷贝（内存地址不同）
b = 20;
console.log(a); // 10（原始值不变）

// 引用类型拷贝
let obj1 = { value: 1 };
let obj2 = obj1;  // 引用拷贝（共享内存地址）
obj2.value = 2;
console.log(obj1.value); // 2（原始对象被修改）

// 深拷贝实现
let origin = { x: 1, y: { z: 2 } };
let deepCopy = JSON.parse(JSON.stringify(origin));
deepCopy.y.z = 3;
console.log(origin.y.z); // 2（原始对象未受影响）
```
关键点：
- 基本类型：Stack内存直接复制值
- 引用类型：Heap内存共享指针
- 深拷贝：通过序列化/反序列化断开引用