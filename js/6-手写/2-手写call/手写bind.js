Function.prototype.myBind = function(context) {
  // 1. 校验调用者是否为函数
  if (typeof this !== 'function') {
    throw new TypeError('The bind method must be called on a function');
  }

  // 2. 保存原函数引用及bind时传入的参数
  const self = this; // 原函数（调用myBind的函数）
  const bindArgs = Array.prototype.slice.call(arguments, 1); // bind时的预设参数

  // 3. 创建中转构造函数（用于维护原型链）
  function F() {}

  // 4. 创建绑定函数
  function boundFunction() {
    // 获取调用时传入的参数
    const callArgs = Array.prototype.slice.call(arguments);
    // 合并bind时和调用时的参数
    const allArgs = bindArgs.concat(callArgs);

    // 5. 处理构造函数调用场景
    // 当使用new调用boundFunction时，this应指向新实例
    // 此时this instanceof boundFunction为true
    return self.apply(
      this instanceof boundFunction ? this : context,
      allArgs
    );
  }

  // 6. 维护原型链继承关系
  // 将中转构造函数的原型指向原函数原型
  F.prototype = self.prototype;
  // 将绑定函数的原型指向中转构造函数的实例
  boundFunction.prototype = new F();

  // 7. 返回绑定函数
  return boundFunction;
};

/* 核心逻辑说明：
1. 参数处理：支持柯里化传参（bind时的参数 + 调用时的参数）
2. this绑定：普通调用时指向context，new调用时指向实例
3. 原型链维护：通过中转构造函数F避免直接修改原函数原型
4. 异常处理：校验调用者必须为函数类型

使用示例：
function foo(a, b) { console.log(this.name, a + b); }
const obj = { name: '绑定对象' };
const boundFoo = foo.myBind(obj, 1);
boundFoo(2); // 输出：绑定对象 3
new boundFoo(3); // 输出：undefined 4（this指向新实例）
*/