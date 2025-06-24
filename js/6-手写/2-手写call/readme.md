# 手写call()

## call 、 apply 、bind 的区别
### 参数的区别
- call 与 apply 都是用来改变函数的 this 指向的
- call 与 apply 的第一个参数都是 this 指向的对象
- call 与 apply 的第二个参数不同
    - call 第二个参数是一个一个的参数
    - apply 第二个参数是一个数组
    - 若没有参数 或参数为null undefined 则 this 指向 window（非严格模式）

    - 若参数为基本类型（string、number、boolean、symbol），this 指向该基本类型的自动包装对象
- bind 与 call、apply 不同
    - bind 不会调用函数 只是返回一个函数
    - bind 可以绑定参数
    - bind 可以绑定 this

### 应用场景的不同
- call、apply 是立即执行的，区别在于参数的传递方式
- bind 不会立即执行，返回一个新函数，延迟执行

## 手写call
- call是属于所有函数的，Function原型链上的方法，任何函数都是Function的实例
1. 要创建一个我们自己的call需要在Function.prototype上添加一个方法
    - 方法的名字叫做myCall
    - myCall的第一个参数是this指向的对象
    - myCall的第二个参数是一个数组
    - 代码如下
    ```js
    Function.prototype.myCall = function (context, ...args) {
        
    }
    ```
2. 要判断调用myCall的是否为函数
    - 若不是函数 则需要抛出异常
    - 要将this指向的对象转换为对象类型
    - 若为null或undefined 则指向window
3. 将目标函数（ this ）临时挂载为 context 对象的一个属性（ fn ）
    - 代码如下
    ```js
    const fnKey = Symbol("fn"); // 使用Symbol生成一个唯一的绝对不重复的，避免与对象原有属性冲突
    context[fnKey] = this;
    ```
    - 使用es6中的Symbol 这样做的目的是为了避免函数名与上下文对象中的属性名冲突
    - 挂载完成后，就可以通过 context.fn(...) 来调用函数了
4. 调用函数
    - 代码如下
    ```js
    const result = context[fnKey](...args); // 展开运算符，将数组转化为参数列表
    ```
    - ...args 是展开运算符，将数组转化为参数列表
    - 
5. 删除临时挂载的属性
    - 代码如下
    ```js
    delete context.fnKey;
    ```
    - 这是由于我们需要在调用函数后将临时挂载的属性删除，以避免污染上下文对象。
6. 返回调用函数的结果
    - 代码如下
    ```js
    return result;
    ```