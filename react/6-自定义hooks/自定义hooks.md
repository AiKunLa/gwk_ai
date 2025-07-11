# 自定义hooks
自定义hooks是现代react app的架构一部分，框架只能做公共部分，不同业务逻辑可以使用自定义ahooks来实现。
- 自定义hooks以use开头，
    可以在多个组件中使用，也可以在多个自定义hooks中使用
- return
    自定义hooks可以返回多个值，也可以返回一个对象，也可以返回一个函数
hooks是函数编程思想的体现，可以让组件更好的聚焦于模板的渲染，全面hooks函数式编程

- 两个遗憾
    - 引入hook的路径写法存在问题../../
    - toggle 、 delete，跨越组件层级有点多，使用useContext来解决

- css 亮点
    - 使用stylus 它是css的超级（预编译语言），它可以使用变量，函数，循环，模块化等
    - 为什么在react中不需要编译stylus，因为vite在开发环境下会自动编译stylus。vite来自于vue社区
    - react组件设计
        - 组件是任务开发单位
        - 组件设计思路：界面功能、状态、响应式
            新建todo、修改todo、删除
            - 展示需要列表
            - 新建需要表单
        - 组件划分
            TodoForm 表单组件:修改增加
            list 列表：展示框
                item 列表项 展示内容 : 当数据被修改时只有当前item会进行重新挂载
        - 组件数据流动
            父组件持有数据，字组件通过父组件传递过来的自定义函数来通知父组件修改数据状态，这样就确保了单项数据流

## react hook
hook是react提供的一组函数，用于在函数组件中使用状态和其他react功能。
useState：用于定义状态的hook，它接受一个初始值作为参数，并返回一个包含当前状态和更新状态的数组。




## css
- 字体
    // 可以设置多个字体，若系统中第一个字体没有则用第二个，苹果设备可以做优化，使用-apple-systm 将苹果字体放到最前面（这是为了用户体验）
    font-family Arial,sans-serif
- rem
    相对单位
    在移动端的重要单位 因为px 是绝对单位，在不同的设备上显示的大小是不一样的，所以需要使用相对单位
    如vw/vh(viewport) em(相对于自身等比例) rem（相对于html 的font-size） 可以在所有设备上适配
- 背景
    背景颜色

## jsx树形解析
<></>（） 这个是react为了解决

## vue 和 react区别
- vue好入门，它提供了很大的好用api，而react倾向于原生js
- props
    外部传递数据，子组件不能修改（参数数据）
    单向数据流
- state
    组件内部数据，组件自己控制（私有数据）
    响应式

- 数据绑定
    变量被称为数据状态，当Data binding **数据绑定**之后 变量就成为了数据 
    const [todo,setTodo] = useState({
        title:'',
        isCompleted:false
    })
    <input type="text" name="title" id="todo-title" value={todo.title} onChange={(e)=>setTodo({...todo,title:e.target.value})}/>
    - 数据和界面状态统一：界面由数据驱动 数据和界面状态一致
    
    vue使用v-model来实现数据绑定，而react使用value和onChange来实现数据绑定，vue性能较差

- useState
    const [todo,setTodo] = useState({
        title:'',
        isCompleted:false
    })
    当为对象时，setTodo() 必须接受一个新的对象，而不能直接修改对象的属性。

## localStorage
localStorage是挂载在window上的
location
history
- BOM Browser Object Model 浏览器对象模型
    浏览器提供的一些对象，用于操作浏览器的一些功能
    - localStorage 本地存储
    - sessionStorage 会话存储
    - location 地址栏对象
    - history 历史记录对象
- DOM Document Object Model 文档对象模型 （可见区域）
    浏览器提供的一些对象，用于操作文档的一些功能
    - document 文档对象
    - window 窗口对象
- DOM Browser 

- localStorage于cookie的异同
    存储大小方面：cookie比较小4kb，LocalStorage比较大5MB（再大的话就直接存数据库IndexDB），应为每次请求都需要携带cookie，若cookie很大的话会影响http性能。而且cookie在前后端都可以设置

    生命周期：localStorage永久存储，cookie可以设置过期时间,过期时间是为了（关闭浏览器失效）
        两者都有domain：域名 表示可以在哪些域名下使用

    是否发生到服务器：localStorage只在客户端，cookie每次请求都会携带
    API易用性：localStorage提供易用API，cookie需要先解析
    存储类型：localStorage只能存储字符串（存对象需要序列号JSON.stringify()），cookie仅字符串
