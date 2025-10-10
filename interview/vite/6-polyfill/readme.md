# polyfill

- polyfill用于在旧的浏览器中实现新的API，或者模拟新的API的行为
    PolyFill就是兼容补丁，当浏览器不支持新特性时，（Promise fetch Array.include），可以使用一段代码来模拟，也就是手写，可以在旧的环境可以跑起来，从而可以提高兼容性

- babel怎么实现polyfill， @babel/core @babel/cli @babel/preset-env
  babel本身只是转译语法 比如将箭头函数转为普通函数，但不会补全api
  使用@babel/preset-env 配合useBuiltIns：‘useage’ 根据使用的API 从core-js中按需引入对应的ployfile

pnpm i @babel/core @babel/cli @babel/preset-env -D
pnpm i core-js@3 -D
