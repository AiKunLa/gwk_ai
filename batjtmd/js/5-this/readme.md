# 
var a = 10;
(function a() {
  a = 20;
  console.log(a);
})
();

- 上述的结果是function

## 函数的声明
- 返回结果是函数本身
- 如果是严格模式则报错Assignment to constant variable.
- 对js更加严格
  函数名a在函数体内部是局部变量，它是只读的，因为函数的优先级高于变量的优先级
  虽然js是弱类型语言，可以随意修改变量的值，但是函数在函数体内部是只读的，不能修改

## js运行环境有哪些
- 严格模式 ：在严格模式中
- 浏览器环境 （一般以这个为主）
- node环境
- web worker环境

## 为什么var 声明的变量会在前端挂载到window对象上
- 全局变量和顶层对象的属性是等价的
- 在浏览器中顶层对象就是window对象。但是在node环境中，顶层对象是global对象
- 在es5之前 全局全局变量和顶层对象的属性是等价的 但这样会污染顶层对象
- es6 let const 全局变量会怎样？会放在那里 
 - 在es6中，let const 声明的全局变量不会挂载到顶层对象上，而是在块级作用域中，最顶级的作用域块，<script></script> 脚本块
 - 使用断电调试来查看变量的作用域

## this
- this是什么
 函数**执行**的时候，会立即生成的对象，这个对象就是this （this由调用方式决定）
- this指向
 函数执行时，this指向调用它的对象
- this指向变化
 1. 函数调用时，this指向调用它的对象
 2. 函数作为对象的方法调用时，this指向该对象

- 函数的调用方式
 - 1. 普通函数调用 eg: fn()  相当于window.fn()  严格模式下this指向undefined，因为它认为this指向window没有必要 
 - 2. 对象方法调用 eg: obj.fn()
 - 3. 构造函数调用 eg: new fn() 指向实例对象
 - 4. 箭头函数调用 eg: () => {}  箭头函数本身没有this 指向箭头函数的上一级作用域的this
 - 5. 事件回调函数调用 eg: btn.onclick = function() {} 指向事件源对象 事件发生对象 调用者


### 改变this指向
call_apply_bind
- 是什么：call、apply和bind都是函数对象原型prototype中的方法
- 作用：改变函数的this指向 为第一个参数

var a = {
        name: "张三",
        func1: function () {
          console.log(this.name);
        },
        func2: function () {
          setTimeout(function () {
            //这里的this指向的是window，因为setTimeout是全局函数，所以this指向window 而全局中没有所以会报错
            this.func1();
          }, 1000);
        },
        func3: function () {
          setTimeout(() => {
            // 箭头函数中没有this，argument。 这里不叫this丢失  这里的this实际上
            console.log(this); // this指向a
            this.func1();
          });
        },
        func4: function () {
          setTimeout(function(){
            // 使用
          }, 1000);
        }
      };

解决方法
1. 用一个变量来接收this  （常用）
  var _this = this; // 这种做法被称为 显示绑定 实际上是通过作用域链 

2. call apply bind （不常用） 使用方法
  setTimeout(function(){
            // 使用
          }.call(a), 1000);

      var a = {
        name: "张三",
        func1: function () {
          console.log(this.name);
        },
        func2: function (a, b) {
          console.log(a, b, this.name);
        },
      };
      const b = a.func2;
      // call是函数对象原型上的方法
      b.call(a, 1, 2);
      b.apply(a, [1, 2]);
       // bind 不会调用函数 而是返回一个新的函数 新函数的this是指定的this 这样可以延迟执行
      const c = b.bind(a);
      c(3, 4);

### 函数为什么既可以作为一个函数来执行 又可以作为构造函数创建对象
- 因为函数的本质是一个对象 他内部有constructor（可构造） 和 call（可执行） 两个方法

function Person(name,age){
  this.name = name;
  this.age = age;
}

Person.prototype.sayHi = function(){
  console.log(`Hello, ${this.name}`)
}
let person = new Person("张三",18)
console.log(person.sayHi())
console.log(person.__proto__ === Person.prototype)

- 分支
 函数作为一个函数执行时：走的是call 
 函数作为构造函数执行时：走constructor 创建一个新的对象 这时this执行的是新对象
 

## 立即执行函数
