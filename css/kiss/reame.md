# css animation 两个表情圆贴贴
- html
  两个div就是两个小圆
  每个圆都有表情

## - div#l-vall.ball  快捷操作  #表示id选择器 .表示类名
  创建一个div id为l-vall 类名是ball
  1. 为什么可以这样写 这是emmet语法 css选择器
- #l-vall.ball  快捷操作  #表示id选择器 .表示类名
- .comtainer>#l-vall.ball+#r-vall.ball  
  1. 快捷操作  #表示id选择器.表示类名 +表示相邻兄弟选择器  >表示子元素选择器  .表示类名

- 为什么要有id和class
  1. id是唯一的，它不可重复 可以通过id来查找元素。
  2. class 表示一类元素 类名可以重复 可以通过类名来查找元素。

## - css
  如何让两个表情圆有贴贴的效果
  1. 如何实现盒子页面垂直水平居中 
  当div没有设置宽度时 div会自动适应内容的宽度 100% 
  2. 设置div的宽度和高度  100px 100px
  3. 设置position position: absolute; 绝对定位 相对于父元素定位 父元素没有设置position时 相对于body定位
  absolute: 找离他最近的的position不为static 若都没有就会相对于body定位
  relative: 除了告诉子元素相对于它定位，还会相对于自身的位置定位（用于微调元素位置）
  static: 取消定位 没有定位能力 元素按照正常文档流（从左到右、从上到下）布局， top 、 right 、 bottom 、 left 等定位属性 不会生效 。
  
  
  4. 设置top和left top: 50%; left: 50%;
  5. transform: translate(-50%, -50%);  属性调整元素自身的位置偏移 平移  50% 50% 相对于自己的50% 50%

- 面向对象的css
  继承、多态、封装、抽象


##  - display元素
    作用：切换行内块级的格式化上下文功能
    inline-block 行内块级元素  可以设置宽度和高度不会换行 可以设置margin和padding 因为块级元素对占一行，行内元素又不能设置宽高
    block 块级元素 可以设置宽度和高度 可以设置margin和padding 可以设置float
    inline 行内元素 可以设置margin和padding 不能设置宽度和高度 不能设置float


## 为什么有的元素会有默认的margin和padding
这是因为浏览器的默认样式表
### 统一样式
  1. 去掉默认的margin和padding ——》css 样式重置
* {
  margin: 0;
  padding: 0;
}

