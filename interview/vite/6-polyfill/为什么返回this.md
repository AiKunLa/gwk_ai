# 为什么 Promise.then() 要返回 this？

## 🎯 核心答案

**返回 `this` 是为了实现链式调用（Method Chaining）**

## 📊 图解说明

### 情况 1：不返回 this ❌

```javascript
function MyPromise() {
    this.then = function(callback) {
        // 执行一些逻辑
        // 没有返回任何东西
    }
}

const p = new MyPromise();
p.then(fn1);           // ✅ 可以
p.then(fn1).then(fn2); // ❌ 报错！因为第一个 then() 返回 undefined
```

**执行过程：**
```
p.then(fn1)           → 返回 undefined
  ↓
undefined.then(fn2)   → 💥 报错！undefined 没有 then 方法
```

---

### 情况 2：返回 this ✅

```javascript
function MyPromise() {
    this.then = function(callback) {
        // 执行一些逻辑
        return this; // 🔑 关键：返回当前对象
    }
}

const p = new MyPromise();
p.then(fn1).then(fn2).then(fn3); // ✅ 成功！可以一直链下去
```

**执行过程：**
```
p.then(fn1)           → 返回 p（this）
  ↓
p.then(fn2)           → 返回 p（this）
  ↓
p.then(fn3)           → 返回 p（this）
  ↓
...可以无限链下去
```

---

## 🔍 原始代码详解

```javascript
if(!window.Promise){
    // 手写一个Promise
    window.Promise = function(executor){
        let onResolve;  // 1️⃣ 保存回调函数
        
        this.then = function(callback){
            onResolve = callback;  // 2️⃣ 存储回调
            return this;           // 3️⃣ 返回当前 Promise 对象
        }
    }
}
```

### 执行流程分析

```javascript
// 创建 Promise
const p = new Promise((resolve) => {
    setTimeout(() => resolve('完成'), 1000);
});

// 链式调用
p.then(fn1).then(fn2).then(fn3);

// 等价于：
const result1 = p.then(fn1);      // result1 = p (因为返回了 this)
const result2 = result1.then(fn2); // result2 = p (因为返回了 this)
const result3 = result2.then(fn3); // result3 = p (因为返回了 this)
```

---

## 💡 更直观的例子

### 例子 1：数组的链式调用

```javascript
[1, 2, 3, 4, 5]
    .filter(x => x > 2)   // 返回新数组
    .map(x => x * 2)      // 返回新数组
    .reduce((a, b) => a + b); // 返回结果

// 每个方法都返回一个数组（或值），所以可以继续调用
```

### 例子 2：jQuery 的链式调用

```javascript
$('.box')
    .css('color', 'red')    // 返回 $('.box')
    .addClass('active')     // 返回 $('.box')
    .fadeIn();              // 返回 $('.box')

// 每个方法都返回同一个 jQuery 对象，所以可以继续调用
```

### 例子 3：Promise 的链式调用

```javascript
promise
    .then(result => result + 1)  // 返回 promise (简化版) 或新的 promise (真实版)
    .then(result => result * 2)  // 返回 promise
    .then(result => console.log(result)); // 返回 promise

// 每个 then() 都返回一个 promise 对象，所以可以继续调用
```

---

## 🎨 代码对比

### ❌ 不返回 this 的写法

```javascript
function BadPromise() {
    this.then = function(callback) {
        console.log('执行 then');
        // 没有返回
    }
}

const p1 = new BadPromise();
p1.then(() => {});              // ✅ 可以
p1.then(() => {}).then(() => {}); // ❌ 报错！
```

### ✅ 返回 this 的写法

```javascript
function GoodPromise() {
    this.then = function(callback) {
        console.log('执行 then');
        return this; // 🔑 返回 this
    }
}

const p2 = new GoodPromise();
p2.then(() => {});              // ✅ 可以
p2.then(() => {}).then(() => {}); // ✅ 可以！
```

---

## 📝 总结

1. **`this` 是什么？**
   - `this` 指向当前对象（这里是 Promise 实例）

2. **为什么要返回 `this`？**
   - 为了实现链式调用
   - 让代码更优雅、更易读

3. **返回 `this` 的好处**
   - ✅ 支持链式调用：`p.then().then().then()`
   - ✅ 代码更简洁
   - ✅ 符合 Promise 规范

4. **如果不返回 `this` 会怎样？**
   - ❌ 只能单独调用每个方法
   - ❌ 不能链式调用
   - ❌ 代码冗余

---

## 🚀 真实 Promise 的区别

**注意：** 真实的 Promise.then() 不是返回 `this`，而是返回一个**新的 Promise**！

```javascript
const p = new Promise(resolve => resolve(1));

const p1 = p.then(x => x + 1);  // p1 是一个新的 Promise
const p2 = p1.then(x => x * 2); // p2 又是一个新的 Promise

console.log(p === p1);  // false，不是同一个对象
console.log(p1 === p2); // false，不是同一个对象
```

但原理相同：**返回一个对象，让后续可以继续调用 `.then()`**

---

## 🎯 记忆口诀

> **"链式调用必返回，返回 this 是关键"**
> 
> - 链式调用 = 连续调用多个方法
> - 必返回 = 每个方法都要返回对象
> - 返回 this = 返回当前对象本身

