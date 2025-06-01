# Github 最受欢迎 50 projects

## 1.使用合适的标签BEM类名

## 2.样式

body { /*没有默认的高度 其高度是由子元素撑起来的*/
    display: flex; /* 弹性布局：单纯的块级和行内不足以满足布局 */
    align-items: center; /* 负责纵向 垂直居中 */
    justify-content: center; /*主轴x 水平居中 */
    height: 100vh; /* 高度100% 相对于视窗的高度  一屏高度100vh，等比例划分  */
    overflow: hidden; /* 溢出隐藏 */
}
### - 使用弹性布局居中 方案
只有弹性布局才有主轴和纵轴  flex是移动端时代新的布局方式 （布局上下文，使用flex即初始化新的规则）
align-items: center; 与 justify-content: center; 与flex是绑定的 两者依赖于flex
通过上述属性可以使子元素水平垂直居中
- display : flex ：格式化上下文，子元素们不会换行

### - 100vh 相对单位
height: 100vh; vh是相对于视窗的高度  一屏高度100vh，等比例划分

### - 等比例划分 flex
子元素之间会根据flex的比例来划分 父元素的宽度
以最小的flex值来划分 其他子元素会根据flex与最小flex比值来划分
flex: 1;

### transition
- 实现过渡效果  过渡时间  过渡方式  过渡延迟
- 过渡效果：transition: all 0.5s ease 0s;



## 布局
### - 居中
position: absolute;
top: 50%;
left: 50%;
transform（变基属性）: translate(-50%, -50%); // 相对于自身移动

### - 水平居中
position: absolute;
left: 50%;

