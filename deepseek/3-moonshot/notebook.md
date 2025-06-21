# 智能前端之图片识别






# Question

## Question1
react 在StrictMode下，会执行2次render，原因是什么？
React StrictMode会在开发模式下有意的调用某些生命周期方法两次，以及渲染两次
- StrictMode react默认启动的是严格模式—— 执行一次，测试一次 一共两次

## Question2
- 在删除StrictMode之后，删除不必要的代码 导入的

## Question3
import.meta.env.VITE_API_KEY 导入meat下环境变量之中的VITE_API_KEY
- 什么是环境变量 ： 环境变量是在操作系统中一个具有特定名字的对象，它包含了一个或者多个应用程序所使用的信息。

- 这样不用将重要的信息暴露在代码中

- 代码可以和环境变量进行交互

## react 中 className
class是js中的关键字
 - react运行jsx时 ，是以原生js来运行的，使用className代替class
- 是什么：在 React 组件中， className 是用于指定 HTML 元素类名的属性，相当于原生 HTML 中的 class 属性
- 为什么使用className
    在 React（JSX 语法）中， class 是 JavaScript 的保留关键字（用于定义类名），
    SX本质是JavaScript的语法扩展，会被编译为 React.createElement 函数调用。如果直接使用 class 作为属性名，会被JavaScript引擎识别为类定义语法，导致语法解析错误。
    因此不能直接用于 HTML 元素的类名定义。

## 无障碍访问
{/* 无障碍访问 */} 点击label标签时也能经行文件上传
label htmlFor + input#id
<label htmlFor="fileInput">文件</label>
<input
    id="fileInput"
    type="file"
    className="input"
    accept=".jpg,.jpeg,.png,.gif"
    onChange={updateBase64Data}
/>

## <meta data-n-head="ssr" name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover">
- 作用： 移动端页面的适配 user-scalable = no 多次点击不缩放
- 什么是移动端页面的适配： 移动端页面的适配是指在移动端浏览器中，页面的布局、字体大小、图片大小等元素的适配，以保证页面在不同的设备上显示效果一致。
- 移动端页面的适配的原理： 移动端页面的适配的原理是根据设备的屏幕宽度、屏幕高度、像素密度等因素，动态调整页面的布局、字体大小、图片大小等元素的大小，以保证页面在不同的设备上显示效果一致。


## 本地预览文件
- 本地预览文件是以一个良好的用户体验，告诉用户在发生什么
- 图片上传及处理很慢，需要preview
- onChange
    e.target.files[0] 可以获取到文件信息
    - FileReader 实例
    - readAsDataURL 方法 可以将文件读取为 DataURL 格式
        - 


## 提交按钮
- 由静态的html -》 动态模板 ——》 Status  
- 初始时是禁用，当用户上传图片预览结果呈现后，状态变成可用

## async
使用了async 表示异步操作

## 请求头中为什么要带'Content-Type':'application/json'
- 告诉后端服务器前端传给它的是什么格式的数据

## 'Authorization':`Bearer ${VITE_API_KEY}`
- Authorization：授权
- Bearer 是声明后面是token