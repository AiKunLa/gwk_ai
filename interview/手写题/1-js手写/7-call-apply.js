Function.prototype.myCall = (context) => {
  if (typeof this !== "function") {
    console.log("error");
    return;
  }

  // 获取参数
  let args = [...arguments].slice(1);
  context = context || window;
  context.fn = this;

  const result = context.fn(args);
  delete context.fn;
  return result;
};

Function.prototype.myCall2 = function (context) {
  // 判断是否为函数调用
  if (typeof this !== "function") {
    console.log("error");
    return;
  }

  // 获取参数
  let args = [...arguments].slice(1);

  context = context || window;
  // 在context 上绑定该函数，之后作为对象函数来调用
  const fnSymbol = Symbol("fn");
  context[fnSymbol] = this;

  const result = context[fnSymbol](...args);

  delete context[fnSymbol];

  return result;
};

Function.prototype.myCall3 = function (context, ...args) {
  if (context === undefined || context === null) {
    // 在非严格模式下 使用window  在严格模式下window为undefined
    context = typeof window !== undefined ? window : globalThis;
  }

  const fnSymbol = Symbol("fn");

  context[fnSymbol] = this;

  const result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};

Function.prototype.myApply = function (context, argsArray) {
  if (typeof this !== "function") {
    throw new TypeError("this is not a function");
  }

  if (context === undefined || context === null) {
    context = typeof window !== undefined ? window : globalThis;
  }

  if (argsArray !== undefined && argsArray !== null) {
    if (!Array.isArray(argsArray)) {
      throw new TypeError("argsArray must be a array");
    }
  } else {
    argsArray = [];
  }

  // 该行代码的作用是将传入的context转换为对象，若context为原始值（如数字、字符串、布尔值），会被包装成对应的对象类型；如果本身为对象则不变。这样做是为了保证在 context 上可以添加属性（如下面的 context[fnSymbol]），防止报错。
  context = Object(context);

  const fnSymbol = Symbol("fn");
  context[fnSymbol] = this;
  const result = context[fnSymbol](...argsArray);
  delete context[fnSymbol];
  return result;
};

function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: "Alice" };

// 测试 myCall
console.log(greet.myCall3(person, "Hello", "!")); // "Hello, Alice!"

console.log(greet.myApply(person,['name','nonono']))


// 手写实现 Function.prototype.myBind
Function.prototype.myBind = function(context, ...bindArgs) {
    // 检查调用的是否是函数
    if (typeof this !== 'function') {
        throw new TypeError('调用者必须是函数');
    }

    const self = this; // 保存原始函数

    // 定义一个空函数，用于组合原型链
    function Empty() {}

    // 绑定后的函数
    function boundFn(...callArgs) {
        // 判断是否作为构造函数使用（new 方式）
        // this instanceof boundFn 为 true，则说明使用了 new
        
        // 这里使用 this instanceof boundFn 判断当前函数是否作为构造函数被 new 调用。
        // 如果使用 new 调用 boundFn，此时 this 就是 boundFn 的实例，this instanceof boundFn 返回 true。
        // 如果直接调用（不是用 new），this 就不是 boundFn 的实例，返回 false。
        const isNew = this instanceof boundFn;
        // 如果是用 new 调用，则 this 指向新对象，否则指向 context
        const thisArg = isNew ? this : context;
        // 合并绑定参数与实际调用参数
        const allArgs = bindArgs.concat(callArgs);
        // 用 apply 调用原始函数，传递 this 和参数
        return self.apply(thisArg, allArgs);
    }

    // 维护原型关系：如果原始函数有 prototype，则让 boundFn 的 prototype 指向一个中间对象，其原型为原始函数的 prototype
    if (self.prototype) {
        Empty.prototype = self.prototype;
        boundFn.prototype = new Empty();
    }

    return boundFn;
}

/**
 * 简化版的bind 没有考虑函数作为new
 * @param {*} context 
 * @param  {...any} args 
 * @returns 
 */
Function.prototype.myBindSim = function(context,...args){
  const fn = this
  return function(...callArgs){
    return fn.apply(context,callArgs.concat(args))
  }
}


Function.prototype.myBindDif = function(context,...args){
  // 判断是否为函数
  if(typeof this !== 'function'){
    return new TypeError('调用者不是函数')
  }

  const self = this
  function Empty(){}

  function boundFn(...callArgs){
    // 若作为构造函数来使用，那么context指向实例，否则指向传递过来的context
    context = this instanceof boundFn ? this : context
    return self.apply(context,args.concat(callArgs))
  }

  if(self.prototype){
    Empty.prototype = self.prototype
    boundFn.prototype = new Empty()
  }

  return boundFn

}



// 11-7
Function.prototype.myCall1107 = function(obj,...args){
  // 必须是函数才能调用
  if(typeof this !== 'function') return  new TypeError('The function of call must be a funciton to use!')
  
  
  // 处理传入的对象，传入的对象若是基本数据类型则将其包装,若传入的是undefined或者是null则使用全局变量
  if(typeof obj === undefined ||  obj  === null){
    obj = typeof window !== undefined ? window : globalThis
  }


  // 使用Symbol来生成唯一的属性名，避免造成属相冲突
  const fnSymbol = Symbol('fn')
  obj[fnSymbol] = this

  const result = obj[fnSymbol](...args)

  delete obj[fnSymbol]

  return result

}