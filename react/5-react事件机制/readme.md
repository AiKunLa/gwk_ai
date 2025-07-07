# react事件机制

## js事件机制
1. DOM事件
    - DOM 0级事件
        ```js
            element.onclick = function() { console.log('Clicked'); };
        ```
        html、css、js各司其职
        一般不使用DOM0级事件，这是因为js代码于html代码耦合了，代码可读性与可维护性差。
        所以一般不用行内样式于DOM0及事件

    - DOM 2级事件

    ```js
        // 事件绑定
        element.addEventListener('click', function() {
            console.log('click');
        })
        // 事件解绑
        element.removeEventListener('click', function() {
            console.log('click');
        })
    ```
2.EventTarget.addEventListener()
    语法：
        ```js
            // 事件绑定
            addEventListener(type, listener);
            addEventListener(type, listener, options);
            addEventListener(type, listener, useCapture);
        ```
    第一个参数表示事件的类型，如onclick、DOMContentLoaded、resize等。

    第二个参数被叫做listener而不是callback，callback是异步处理的称呼，这里的listener不是一个简单的异步函数，它是一个监听器，表示未来可能会发生的事情。

    第三个参数(useCapture)是可选的，默认是false，表示事件冒泡:事件从内往外执行，true表示事件捕获:事件从外往内执行。
3. 事件嵌套时，事件的执行顺序是什么
    ```html
        <div id="parent">
            <div id="child"></div>
        </div>
    ```
    ```js
        // 事件绑定
        let parent = document.getElementById("parent");
        let child = document.getElementById("child");
        parent.addEventListener("click", function () {
            console.log("parent click");
        });
        child.addEventListener("click", function () {
            console.log("child click");
        });
    ```
    在事件嵌套（事件委托或父子元素都有事件监听）的情况下，事件的执行顺序取决于事件监听是在 捕获阶段 还是 冒泡阶段 注册的。
        事件冒泡：事件从内往外执行
        事件捕获：事件从外往内执行
    事件捕获阶段：
        在浏览器中捕获事件发生的位置，然后事件首先从最外层的 window 对象开始，逐级向下传递到目标元素的每一层祖先，最后到达实际触发事件的元素。
    冒泡阶段：
        事件冒泡阶段：事件从目标元素开始，逐级向上传播到最外层的 window 对象。
        在事件冒泡阶段，事件监听器按照它们在 DOM 中的嵌套层次从内向外触发。
        这意味着如果在冒泡阶段为一个元素注册了多个事件监听器，它们将按照注册顺序逆序执行。
4. 事件分为三个阶段，但event.target只有一个（事件发生的终点）
    捕获阶段——>目标阶段（eventtarget事件发生的位置）——>冒泡阶段
    前两个只是指定事件执行的顺序
5. 为什么有了捕获还要冒泡 
    事件委托：利用事件冒泡机制，将事件处理程序绑定到父元素上，而不是每个子元素上。
    当事件发生在子元素上时，事件冒泡到父元素上，触发事件处理程序。

        当某个 DOM 元素触发事件（如 click），该事件会从目标元素开始，逐级向上（冒泡） 传播到 document 或 window。
        因此，我们可以在 父元素 上统一监听事件，再通过 event.target 判断实际触发事件的子元素。

    事件委托的优势在于：
        1. 节省内存：不需要为每个子元素都添加事件处理程序。
        2. 动态添加元素：可以在运行时动态添加元素，而不需要为每个新元素都添加事件处理程序。
        3. 统一事件处理：可以为多个子元素添加相同的事件处理程序，而不需要为每个子元素都添加事件处理程序。
    事件委托的劣势在于：
        1. 事件处理程序的执行上下文不同：事件委托的事件处理程序的执行上下文是父元素，而不是子元素。
        2. 事件处理程序的执行顺序不同：事件委托的事件处理程序的执行顺序是按照事件冒泡的顺序执行的。
```html
<body>
    <div id="container">
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
        <div class="item">4</div>
        <div class="item">5</div>
    </div>
    <script>
        document.getElementById('container').addEventListener('click', function(e) {
            console.log(e.target.textContent)
        })
    </script>
</body>
```
虽然我们可以为每一个元素添加事件处理，但是这样需要注册多个事件，这样的性能很差。
event.target 是事件发生所在的元素，不是事件监听所在的元素。可以使用这个特性将事件委托到上级元素上

## 循环 
1. 计数循环对cpu友好
2. for(let itme of list) 更加语义化
3. for(let i=0; i<list.length; i++) 性能更好