# Ts

1. 为什么不用ts
    第一个项目专注于react全家桶开发，还没有使用，但是能搞定常见react + ts开发

2. 对ts的泛型怎么理解
    泛型是类型的函数，T是占位符，它可以接收类型参数返回新类型，让代码能够重用并使类型更具安全
    泛型是在类型层面引入参数化机制，他的核心目标是在编译期间提供类型安全，并保持代码的复用性


## type 与 interface

由于js是弱类型语言，容易出问题 ts带来了类型约束。react + ts是开发的标配
使用ts可以自定义类型，用于约束一个对象的属性方法。或者用于约束方法接收的参数或者返回值

interface和type都可以用于描述对象的结构


- type 与 interface 都可以用于声明自定义类型
    - interface面向对象，可拓展extends 专门描述对象，可以拓展合并，适合大型项目中的可拓展API
    - type 灵活，组合能力强，可以定义任何类型，交叉类型，不支持重复声明合并，经常用于类型别名
    - 区别在于
        type的拓展使用&，而interface则是使用extends
            ```ts
                interface Child extends Person
                type ChildType = PersonType & {name:string}
            ```
        type不可以重复声明否则会报错，而interface可以重复声明并会自动合并声明
            ```ts
                interface Child {name:string,age:number}
                interface Child {Id:number}
                // 最后的结果为
                interface Child {name:string,age:number,Id:number}
            ```
        type支持所有类型
            而interface只支持对象类型的声明，不支持元组，联合类型等声明
            ```ts
                type ID:string | number
                type Point = [number,number,sting]
            ```
        type 可以用于声明简单数据类型的别名而interface不行
            ```ts
                type NumberFirst = number
            ```