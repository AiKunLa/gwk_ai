# 3-2more 接2

## css选择器升级版

有了弹性布局为啥还要有display:行内块
- 弹性布局的兼容性问题
- 行内块的兼容性问题

## line-height: 1.6;
这1.6是什么意思
为什么是1.6

## min-width  max-width


## text-decoration
文本修饰

## 伪元素
- ### 为什么被称为元素
    因为它可以像元素一样，出现在DOM树之中，但是又没有这个标签 它依赖于css中的声明

-  不需要在html中声明
在css中使用类似伪类的
选中元素内容开始之前    ::before
内容结束之后    ::agter
可以向元素**标签**一样出现在DOM树中，但是又不是标签，这就是伪元素

- ## 注意事项
- 伪元素中content属性必须有
 content 表示伪元素中的内容，一般为空
 若没有则不显示

## 作用
- 好处
    不用写标签就可以完成界面效果，

- 作用
    下划线，向右点进去的箭头

### 箭头
- &gt;


## 居中对齐
### 文本居中
### 元素居中


## transform transition

  transform: scaleX(0);这个属性的作用是将元素在水平方向上缩放到0 ,因为scaleX(0)会使元素的宽度变为0，所以这个伪元素初始是隐藏的
  transform-origin: bottom right; 设置变换的原点，默认情况下原点是中心位置，这里是右下角 
  transition: transform 0.3s ease; 这个属性定义了变换的过渡效果。 0.3s 表示过渡的时间  ease 表示过渡的效果 是一个缓动函数

  变换点在左下角  
  transform scaleX(1) 将元素
  transform-origin bottom left 