# 6px
- 之前浏览器支持的最小字体是12px，现在可以支持更小的字体了

- 1px 像素
    - 由于移动端分辨率高，1px 边框看过去有点粗，由于不能设置0.5px
    - 可以使用为元素来做边框
        这样很方便 伪元素必须要有content 
        通过定位 让它专职做下边框
        使用transfrom scaleY(0.5) 来对其进行收缩
        使用transform-origin: center bottom;来控制收缩的点