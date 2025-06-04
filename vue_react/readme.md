# Vue-React

js 原生-》vue+react

## 语义化标签之 table

<table>
    表头
    <thead>
        <tr> // 行 
            <th>姓名</th> // th是表头，td是表体  
        </tr>
    </thead>
    表体
    <tbody>
        <tr> // 行
            <td>张三</td> // 列 数据挂载点 v-for 循环
        </tr>
    </tbody>
    表尾
    <tfoot></tfoot>
</table>

## DOM编程
- 1. 操作DOM节点,将界面动态更新

## 样式 用户体验 
- 引入第三方库Bootstrap
- .container 容器 固定宽度 居中
- 引入框架的好处 : 1.不用去写细节和重复代码,focus业务

## 如何将js代码交给框架去做,focus业务
- 从而诞生了vue react jquery 等框架, 但还是jquery退出了舞台
- vue
  聚焦于业务,远离AIP 循环输出tr

## 现代前端开发框架
- 聚焦于业务 App概念
 - Vue.createApp(App).mount('#app') 函数创建应用实例, 应用实例是一个对象, 包含了应用的所有功能
 - #app 是一个选择器 不用再写低级的DOM操作

- 循环输出数据
 - vue app中提供了data() { friends }
 - tr v-for 配合循环输出业务

 ## react 
 - react来自于FaceBook 适合大型应用
 - 创建react应用 
 - 1. 初始化 npm init vite 
 - 2. 