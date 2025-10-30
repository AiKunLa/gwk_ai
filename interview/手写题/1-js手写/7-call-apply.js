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
