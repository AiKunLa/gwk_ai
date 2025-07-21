# css 模块化
- Button    AnotherButton 
    自己的组件，别人的组件，第三方组件。组件多了可能会产生冲突。

    当在CSS中定义了两个完全相同的样式规则时，浏览器会选择最后一个出现的样式规则应用到对应的HTML元素上。这是由于CSS的层叠（Cascading）特性决定的，即后面的规则会覆盖前面的相同规则。 这样会导致样式的覆盖
- 解决办法
    唯一类名
    css 模块化，命名空间
        使用模块化方案，不会影响外界的样式
    - 当引入 style.module.css 时
        通过react vite工程化，来引入唯一的hash值来作为类名，这样就不会冲突
        那么这样的可读性是否会变差
            不会，因为读取的是源码(代码的可读性只和源码有关)，任然是我们定义的类名，被模块化保护起来了。可以使用npm run build 来查看打包后的文件。
    - dev build test product
        dev 开发环境
            注意代码的可读性要高，方便调试。
            使用style.module.css 来定义样式。import styles from './styles.module.css';  中的style 是一个对象，key 是我们定义的类名，value 是 hash 值。
        build 打包
            打包后的文件，类名会被压缩，变成hash值。
        test 测试环境
            npm run test
        product 生产环境
            aliyun ngnix


    - vue scoped

