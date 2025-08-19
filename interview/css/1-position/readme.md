# position
position 底层原理
- 脱离文档流表示元素不在按照正常的文档流进行布局
1. static
    默认、元素的定位是根据文档流来定位的。
    回到文档流，按冲上到下从左到右
2. absolute
    绝对定位，它相对于最近祖先元素上设置了position为非static的来的元素来定位。若祖先元素上没有设置，则相对于body定位
3. relative
    它是相对定位，相对于自身原来的位置偏移，不脱离文档流。它不会对其他元素布局造成影响。
4. fixed
    相对于视窗定位
5. sticky
    它是粘性定位，当元素滚动到特定阈值之前表现为相对定位，若到达阈值则表现为fixed，实现类似吸顶或吸附的效果

- 举案例、业务场景
    - 结relative + absolute 来做消息提醒
    - absolute + transform 水平垂直居中 模态框
    - fixed 回到顶部 聊天客服图标
    - sticky 粘连导航，不管页面有多长，当滚动导航在超出阈值后，一直都在顶部。
        table粘连，距离其最近的具有滚动机制的祖先容器
        和IntersectionObserver 优点像
    - 铺满全屏

- 底层
    - 定位参照
        absolute 找最近position != static 的祖先 若没有则找body
        fixed 相对于什么，相对于视窗？ 不一定，
        statick 依赖滚动容器
        - 独立图层渲染
            单独的absolute 是不会进行独立图层渲染，要使用transform:translateZ(0)。或translate3d(0,0,0)，可以提升为一个新的图层
            可以调用GPU硬件加速，有利于css页面性能优化。但也不能乱用，过多的图层会增加内存和管理开销
            应用：登录弹窗，transform/opacity/动画

            will-change: 可以触发独立图层
            遇到的问题：
            position: fixed 如果在transform: translateZ(0) 下面，会失效。transform会有一个新的包含块 fixed不再对于视口定位，而是相对于这个transform容器定位
- 用打麻将的方式来，让每道题都惊喜 刺激
    当面展示自己

position回答技巧
- 先干净利落的回答5种特性，再举出应用场景，提出底层原理。提图层和fixed失效是一个亮点

- 这道题可以引出页面渲染的流程。
- intersectionObserver
- 重绘重排，性能优化