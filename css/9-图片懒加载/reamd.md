# 图片懒加载

## 什么是懒加载
懒加载，也叫延迟加载，指的是在长网页中延迟加载图片。

## 为什么要懒加载

1. <img src=""/> 
    - 每一个img标签的背后都是一个异步的请求
        请求的底层：
        - 浏览器解析html代码，遇到img标签，会创建一个img对象
        - img对象发起一个http请求
            - 浏览器会创建一个tcp连接，三次握手
        - 服务器返回图片资源
        - 浏览器解析图片资源，将图片显示在页面上
    - 网络带宽相当于一条公路，公路的宽度是有限的，单位时间能够通过的车辆是有限的,若一次性请求加载太多的图片，会导致公路阻塞，车辆无法通行，从而导致页面崩溃
2. 页面的打开速度是最重要的

## 怎么实现懒加载
- 1. 思路
 - 只加载可视区域的图片
    - img标签出现在可视区域：浏览器窗口的大小
    - 滚动区域 scroll
 - 对于不在可视区域的图片如何不加载
    - 由于img标签只要有src属性就会发起请求，所以src不能直接给路径，给data-original，
    data-original是
      一个自定义的**数据**属性，用来存储图片的路径，当src属性为空时，img标签不会发起请求，所以不会加载图片
      是一个原来的自定义的数据属性

    - 将真实图片URL存储在自定义属性中（如 data-original ），而 src 属性通常设置为一个占位符（如一个透明的 GIF 图像），只有当图片滚动到视口中时，才将 data-original 的值赋给 src 属性，触发图片加载。
        - src 因该设置 但不能是真实的图片路径
        为什么叫做占位符，因为这不是真实的图片，只是为了占位置，等图片加载完成后，再将图片显示在页面上
        占位图片加载后会缓存，其他img标签加载时直接从缓存中加载
        占位图片一般比较小，且会缓存
    - src是img标签的一个功能函数，

 
2. 如何判断一个盒子是否在可视区
    当一个元素顶部到视口顶部的距离小于视口高度，且底部到视口顶部的距离大于0时，说明该元素在视口中
    以名为react的盒子为例：
    ```js
    function check(){
        // 1. 获取视口高度
        const viewHight = document.getBoundingClientRect().height;

        // 2. 获取react 顶部和底部到视口顶部的距离
        const reactTop = document.getBoundingClientRect().top;
        const reactBottom = document.getBoundingClientRect().bottom;
        // 3. 判断
        if(reactTop < viewHight && reactBottom > 0){
            // 在视口中
            return true;
        }
        return false;
    }
    
    ```

3. 图片加载的实现
    - 遍历

## 性能优化
1. 存在的性能问题
    - 首屏加载
    - 频繁的触发onScroll事件，每次onScroll都需要遍历所有img
    - 每次调用img.getBoundingClientRect() 都会触发回流，这是不能接受的

2. 优化性能
    - 对于img.getBoundingClientRect() 可以使用InterSectionObserver （ observer 观察（观察页面），代表InterSectionObserver是异步的，interSection 交叉，这里是与可视区交叉）
        
        InterSectionObserver 是浏览器提供的异步观察API（属于 HTML5 时代之后的现代 Web API 标准），用于高效监听元素与视口的交叉状态。

        使用InterSectionObserver之后不需要onScroll事件


    
