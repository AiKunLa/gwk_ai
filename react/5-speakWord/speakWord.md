# speakWord开发流程

## 注意点
1. 入口文文件index.html <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no" /> 添加user-scalable=no 防止页面缩放
2. 去除main.jsx中的<StickMode>
3. css reSet
4. 组件思维 —— 组件拆分（按照功能逻辑来划分）
    图片上传区域
    音频播放区域
    单词例句区域
5. 目录结构
    src / 开发目录
        components / 组件目录
            PictureUpLoad / 图片上传区域
            AudioPlay / 音频播放区域
            WordList / 单词例句区域
        main.js / 主入口文件
        App.jsx / 根组件
        assets / 静态资源目录 ： 需通过相对路径导入——组件专属图片、样式文件
    public / 静态资源目录 ： 需使用绝对路径访问——HTML入口文件（index.html）、大型静态资源（如视频）
    index.html  / HTML 入口文件
    .env.local / 环境遍历文件    

6. 各组件持有的状态，子组件的消费
    - App.jsx (state)私有的数据状态
        单词
        例句
        音频
        上传图片方法
    - PictureUpLoad (props) 父组件传递的数据状态，子组件不能自己修改数据，只能通过传递来的方法进行修改
        单词
        例句
        音频
        上传图片方法
    - AudioPlay 组件的状态
        音频
    - WordList 组件的状态
        单词
        例句
        

    

## 如何描述项目
1. 主要功能流程描述
2. 亮点
    使用大模型，
    react组件化思想，单项数据流
3. 难点
    base64编码，blob对象，
4. 性能优化

