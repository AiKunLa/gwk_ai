# diff 算法

- 给两个虚拟DOM树，Vnode Tree，要求输出一个补丁（patches）列表，描述如何把DOM从oldTree变成newTree，
  操作最少
  写一个函数，接收两个tree作为参数，返回一个列表。
  本质上是手写diff算法， 同层比较
  - 同层比较
    类型不同，直接删除。使用递归的方式比较children，根据key比较children
    用移动代替修改，步骤越少越好
