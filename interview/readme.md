# 1. 如何知道多个异步任务全部都完成了
Promise.all(iterable) 接收一个可迭代对象（通常是Promise数组），并返回一个新的Promise，
**该Promise在所有输入的Promise都成功完成时才成功**，如果其中任何一个Promise失败，则它会立即失败，并返回第一个失败的错误原因。
其结果是所有Promise成功值按顺序组成的数组

- 有一堆的promise
- Promise.all() 本省也是一个Promise
- 若有一个promise reject  则返回这个promise的reject原因 
- 只有当所有的promise都resolve 才会返回所有promise的resolve结果
- 不需要实例化


# JS

## 1. 深拷贝和浅拷贝



