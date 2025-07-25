# 回流重绘
- 布局的难点在于列

    - html是根元素，也是最外层的第一个bfc（块级公式上下文）

    - float overflow:hidden flex 

- 为什么table做列式布局但是为什么不用
    1. 语义不和 table被设计出来是为数据二设计的
    2. 会触发太多的回流和重绘


## 浏览器页面的渲染过程
1. 页面渲染过程
    - 接收html ——》 将HTML结构字符串解析转换DOM树形结构。 DOM树构建完毕后 DOMContentLoaded 事件发生
        DOM树构建过程
            - 解析html原始字节，通过UTF-8编码转为字符串
            - 将字符串转为Token，Token是HTML语法的最小单位，如标签、属性、文本等。
            - 生成节点对象并构建DOM树
            - 每一个渲染树节点都包含了对应的DOM节点以及最终计算后的样式信息。
    - CSS解析 → CSSOM树构建 （与HTML解析并行，但有阻塞关系）
        CSSOM树构建过程
            - 解析css原始字节转为字符串
            - 将字符串转为Token，Token是CSS语法的最小单位，如选择器、属性、值等。
            - 生成节点对象并构建CSSOM

    - 渲染树（Render Tree）构建 （依赖DOM+CSSOM）  （应用规则和计算的过程）
        当我们生成 DOM 树和 CSSOM 树以后，就需要将这两棵树组合为渲染树。
        渲染树： 包含每个元素的几何信息（位置、大小）、颜色、字体等属性。

    - 布局与绘制
        布局Layout： 计算每个元素的位置和大小（计算每个渲染树节点的）
        绘制： 将元素绘制到屏幕上

    - 若修改了
        则会重新布局，重新绘制
        重新布局：开销大
        重新绘制：性能可以接受

    - 为什么js不能放在前面
        界面的渲染不需要js，
        因为js会阻塞dom树的构建，会导致页面的渲染阻塞，从而导致页面的卡顿。

2. 图层
    - 图层的概念
        图层 = DOM树+CSSOM树-》渲染树-》布局-》绘制
        每个图层都是一个独立的渲染上下文，每个图层都有自己的渲染树，
        当一个图层的内容发生改变时，浏览器会重新渲染这个图层，而不会影响到其他图层的内容。
    - 为什么会有图层
        若元素都在一个图层，当改动一个元素的布局时，就会改动整个图层，会导致整个页面的重绘和重排。
        由于动画效果

        对于不同图层的页面改动
        - 对于文档流的元素，会以单独的图层进行渲染，当被修改了只需修改这一个图层即可，
        - 对于动画元素，会以单独的图层进行渲染，当被修改了只需修改这一个图层即可，

        - 图层 z-index 或 position  transfrom opacity 会触发重新布局
            对于离开文档流的元素，会以单独的图层进行渲染，当被修改了只需修改这一个图层即可，
    - 图层合并
    
当整个页面（包括所有图像、样式表、脚本等外部资源）加载完成后，会触发 onload 事件并执行绑定的函数。



## 回流和重绘的概念
1. 回流：reflow
    当RenderTree（渲染树） 中的部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程。这就称为回流（reflow）。
    当table的局部发生变化时，会导致table的重新布局，这就会导致其他元素的重新布局，从而导致多次回流。

    什么会触发回流
        - 页面首次渲染（严格意义上不是），首次渲染最耗时
        - 浏览器窗口大小发生改变时
        - 元素尺寸或位置发生改变
        - 元素内容的改变
            appendChild removeChild
        - display 从none 变成其他
        - 字体大小的变化
        - 激活css伪类：hover 浏览器需要重新绘制
        - 查询某些属性方法时候
            - img.getBoundingClientRect() 触发回流？

2. 重绘：repaint
    属性当渲染树中的一些元素需要更新，而这些属性只是影响元素的外观、风格，而不会影响布局的，比如background-color。则就叫称为重绘。 即当页面元素的样式发生改变，但布局没有发生变化时。文档流没有发生变化

    - 注意隐藏元素:
        当元素设置visibility:hidden时，元素虽然不可见，但是元素的空间是存在的。仅触发重绘
        当元素设置为display:none时，dom树构建时候会忽略改元素，元素的空间就不存在了。会触发重绘和回流
            ``` html
                <style>
                    .box {
                        width: 100px;
                        height: 100px;
                        background-color: red;
                    }
                    .hidden {
                        visibility: hidden;
                    }
                    .none {
                        display: none;
                    }
                </style>
                <div class="box">box</div>
                <div class="hidden">hidden</div>
                <div class="none">none</div>
            ```

3. 回流的次数

4. 节流