# tts 智能语音

## 智能前端 AI用户体验
- AI语音交互 
   虚拟数字人 AIGC 由文字——》语音

- 如何隐藏敏感信息
 

- webllm 是一个基于大模型的前端AI用户体验平台，通过调用AI大模型实现相关业务

- tts 语音
 - 如何在网页播放音乐
- 用户体验
 - 音乐的播放权因该在用户手中，让用户来决定是否播放

- 单项数据流
 - 由于react要保持数据状态和和界面统一 不能
 - 数据和状态都是单向的 

## 使用react实现音乐播放
- 原生的DOM API开发低效 
- react 不使用dom编程

## 路径
- 相对路径
 ./ 同一级
 ../ 上一级
 ./demo/ 下一级

- 绝对路径
 物理路径：指的是磁盘上的路径，比如C:\Users\Administrator\Desktop\react\demo\src\components\music\Music.js
 网站根路径 /music/Music.js  ——》 http://localhost:5173/music/荒 - 潘小明.ogg   端口号代表队是一个服务

 ## react 中各种文件的作用
 - public 静态资源
 - src 
  - App.jsx 
  - main.jsx
 - index.html 入口文件

 ## react 事件机制
 - 在react中不使用addEventListener 等传统DOM编程
  - 使用onClick react等事件 和html原生支持的时间优点象
 
 - 多种时间机制
  - DOM0 
   onclick在html中 耦合严重。不推荐
  - DOM2
   addEventListener html和js分离
  - react 
   - 采用了DOM0的方式，有利于组件html表达 代码可读性好
   Vue中有@click 但是其破坏了原则，react由于click
   - API层面上看上去是这样的，其底层上

## useRef
- 帮助我们在react中拿到DOM对象
- const audioRef = useRef(null); 
<audio ref={audioRef} controls></audio>
- useRef  钩子可以获取DOM元素 通过ref audioRef绑定了 audio

-ref =  useRef(null) 空对象
 - current 属性 null
 - jsx ref={ref} DOM绑定html标签
 ref.current 指向的是DOM对象


## .env.local  环境变量
 - 在本地配置 不需要上传到服务器

