# 路由
1. 页面切换
    传统页面切换
        传统开发，每一次页面的切换都需要一次请求取获取新的html页面，然后进行页面的重新渲染，
        在这个阶段会导致页面的卡顿出现页面白屏，这是一个不好的用户体验
    新的react-router-dom 单页应用 SPA，Single Page Application
        只有一个页面但可以实现多页面效果
            react页面级别组件

        Router/Routes/Route 
            Router：路由组件，包裹所有的路由信息
            Routes：路由出口，用来展示匹配的路由组件
            Route：路由配置，用来配置路由信息
            当url匹配路由配置的path时，会渲染对应的组件    

        核心概念
            url切换，不能使用a标签，要使用Link(Link 会将请求拦截并转为事件)。使用a标签会重新发生一个请求，会导致页面的重新加载。使用Link不去重新发送请求。组件切换局部更新
            url切换是一个事件，hashChange / pushState
            根据当前的url，获取对应的组件并替换原先的组件
            用户体验：url改变了，页面不用刷新 页面也不需要白屏，应为页面都是前端的

        url 改变，但不重新渲染的解决方案
            hash 的改变（锚链接功能）
                <a href="#home">Home</a>
                原来是用来页面锚点，长页面的电梯，它不会发生页面的刷新
            hash 改变会触发hanshChange事件
                window.addEventListener('hashchange', () => {
                    console.log('hash 改变了');
                })
            通过这个事件，我们可以获取到hash值，根据hash值去渲染对应的组件，这样既可以实现url的改变，又可以实现页面的不刷新。


        
        
2. react-router 实现原理
    用Link替代a标签：