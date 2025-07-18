# react-repos

## 前端项目开发流程


1. 路由(先搭建路由)
    在main.js入口文件中添加路由。
        <Router>
            <App />
        </Router>
    细节的注意事项：
        react-router-demo
        /repos/:username
        /respos/:id
        懒加载，路由实现的选择（hash/history）
        通过useParams 获取路由参数对象，通过useNavigate 进行路由跳转
            - useParams 动态参数对象 不能放到useEffect里面，获取后要校验获取到参数（trim，要严谨），若不符合则要跳转，跳转的时机翻入useEffect
2. 数据管理（之后进行全局数据状态管理）
    <GlobalContextProvider>
        <Router>
            <App />
        </Router>
    </GlobalContextProvider>

    App 数据管理
    useContext + useReducer + hooks
    将数据状态交给context reducer管理
3. 组件
    细化组件颗粒度

4. axios
    将axios http请求独立出来，形成一个模块
    axios的底层使用的是xhr，这是因为xhr是标准http请求库  。axios返回的是Promise
    BASE_URL 是所有接口地址的公共部分
