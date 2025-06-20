# localStorage


## stylus

- ### 是什么
- stylus是一个css预处理语言 它更快 更简洁  让css更像编程
- stylus 是css的超集 浏览器不能识别stylus 需要进行编译

- ### 安装
- npm install -g stylus 安装stylus
- stylus --version  查看版本

- ### 编译
 - 命令行编译 
 - stylus -w ./common.styl -o ./common.css     带w表示动态编译 一边写一边编译
 - -w 监控文件变化
 - -o 输出文件
- ### 特性
- stylus让css如js一样
 - 拥有模块特性
  tab 缩进 自动补全css前缀
  拥有模块和作用域、变量的特性


# box-shadow
## 语法
- box-shadow: h-shadow v-shadow blur spread color inset;
- h-shadow 必需。水平阴影的位置。允许负值
- v-shadow 必需。垂直阴影的位置。允许负值
- blur 可选。模糊距离
- spread 可选。阴影的尺寸
- color 可选。阴影的颜色。在css颜色值寻找颜色
- inset 可选。将外部阴影（outset）改为内部阴影

# 为什么html页面中文字默认黑色的
- 在css中有继承特性
若没有继承特性，则每个元素都要写一遍（一般在body中设置）
- 选择性继承
 - 背景元素不继承


## background
background: url() center no-repeat

## background-size
bockground-size:
- cover : 等比例缩放，裁剪 重点在盒子
- contain : 重点在完整显示背景图片 等比例缩放，不裁剪


# <meta data-n-head="ssr" name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover">
其中的
- width=device-width ： 宽度等于设备的宽度
- initial-scale=1 ： 初始的缩放比例为1，即不进行缩放
- user-scalable=no ： 用户不能手动缩放页面
- viewport-fit=cover ： 视口适配方式为覆盖，即页面内容会等比例缩放以适应不同的屏幕尺寸