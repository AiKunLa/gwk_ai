# WEUI 上传界面
源码
- 思维方式
- 技能点
 - 
 - BEM  class命名规范
  - hd 头部
  - bd 主体
  - ft 底部
 - 弹性布局
 - stytus 变量，模块化
 - 伪元素

- weui-uploader 源码
 - weui-uploader 上传
 - weui-cells 移动端 WEUI组件库的表单单元格容器 
  - weui-cell 单元格 ： 



## html class命名


## css样式
### page 

// 全局变量 变量组成了界面的风格
$weui-bg-0 = pink
$weui-fg-1 = rgba(0, 0, 0, 0.8)

.page
    <!-- 铺满整屏  给html  body 标签设置 高度100%  这样才能铺满整屏  否则只有中间的内容会铺满  上下会有空白 -->
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    background-color pink
    overflow scroll
    <!-- overflow-scrolling弹性滚动 让滚动更敏感  滚动时会感受滑动的力度 -->
    <!-- webkit 是chrome浏览器内核的代号  带上这个前缀代表只能在这个浏览器中使用  移动端（苹果 安卓）都是使用webkit内核-->
    -webkit-overflow-scrolling touch
    <!-- 这里使用怪异盒子模型是为了  让padding 不撑开盒子  而是撑开内容  这样才能让内容居中 
        - 保证组件尺寸计算一致性，避免嵌套元素因 padding 导致布局错乱
         简化响应式布局代码，无需手动调整 width 来抵消 padding 影响
     -->
    box-sizing border-box
    z-index 1


### float
- float是一个早于flex的布局方案，
- float:left 左浮动， float:right 右浮动
- 浮动元素会脱离文档流，不占位置，不占空间

