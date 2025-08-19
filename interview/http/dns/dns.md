# dns
1. 介绍dns是什么
    dns全称为 Domain Name System
    它是把好理解和记忆的域名解析成为IP地址的**分布式数据库系统**
    浏览器在真正发起http请求前，通常都会做一次DNS解析
    一个ip地址可以对应多个域名
    可以通过 ping www.baidu.com 递归查找过程 结果IP

2. 讲解dns是如何解析域名的
    从url输入到页面显示的第一个表达
    如何解析：
    - 本地查询
        浏览器会**先查看自己的缓存**中是否有最近解析过度该域名记录
        如果缓存中没有，操作系统会**检查本地的DNS缓存**（如hosts）
        **检查路由器缓存**
        C:\Windows\System32\drivers\etc\hosts
        host文件配置，在host中配置 ip 对应的域名。就比如我们在host中设置 127.0.0.1 www.bilibili.com。这时候我们访问www.bilibili.com的时候就会解析为本地了。
        就比如我们会将项目本地ip 配置公司项目的域名，那么开发的效果就可以和线上域名的效果一样。更加安全、开发中经常使用

    - 查询递归DNS服务器
        若没用命中本地缓存，计算机会查询请求发送给一个递归DNS服务器。这个服务器通常由
        假设 访问www.baidu.com，本地没有
        查询DNS 数据库 key=》value
        dsn是一个软件， 13组根服务器ip 地址和域名
        写死的
        - 根域名服务器 
            告诉.com 的服务器地址是多少
        - 顶级域名服务器
            baidu.com服务器在那
            我不知道 example.com 的具体IP，但我知道负责 example.com 这个域的权威域名服务器
        - 权威服务器
            递归服务器问权威服务器：“www.example.com 的IP地址是什么
            权威服务器是最终拥有该域名记录的服务器，它会直接返回 www.example.com 对应的IP地址

TCP、三次握手

3. DNS优化
    - DNS预解析 dns-prefetch 
        <link type="dns-prefetch" href="//g.alicdn.com"/>
    - pre-connect 提前建立TCP连接
        <link data-
        tcp连接提前 打开通道 实现多路复用
    
    正在 Ping www.a.shifen.com [183.2.172.177] 具有 32 字节的数据:
    上述是用于搜索服务器的内部域名系统，它会算出那个服务器有接待能力，若
    域名——》ip 不是绝对一致的。域名的背后是一堆的服务器，分布式的，多地多机房。会寻找就近原则来服务
    负载均衡
        是一个计算服务器，将当前服务交给有接待能力的服务器，
    CDN 服务器
        Content Delivery NetWork 内容分发网络。由于部署静态资源
        将访问内容分成两部分，对于动态内容，走中央数据库。对于静态 如css/js/jps，分给静态资源服务器

