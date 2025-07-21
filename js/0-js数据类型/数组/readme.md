# 数组
在js中数组是可遍历的对象
js数组可以存储任意数据类型的数据，其长度是动态的，可以动态扩容
1. 数组的创建
    字面量创建
    使用new 来创建
        const arr = new Array(10)  此时的arr 为空数组，元素没有值
        灵活地拓展，不限类型，还有hash的特性，使用arr.keys() 可以获取所有的key

        初始化数组
        const arr = new Array(10).fill(0)
        当arr[15] = 1 时，arr的长度会自动扩容到16，arr[15] 为1，其他为空。这时候去遍历只会遍历有不为空的元素，空的元素不会遍历
            arr.forEach((item,index) => {
                console.log(item,index)
            }) 
        使用arr.keys() 可以获取所有的key,包括为空的元素
        for(let key of arr.keys()){
            console.log(key)
        }
    Array.of()
        对已经有的数组进行填充，明确了每一项
        Array.of() 方法创建一个新数组,其参数为数组的元素， 这个方法是类上的静态方法
        const arr = Array.of(1,2,3)
        console.log(arr)

    使用Array.from() 方法，将可遍历的对象转换成数组，如类数组。这个方法的第二个参数为一个函数，用于处理每个元素，进行填充运算。        
        const a1 = Array.from(new Array(26), (val, index) =>
            String.fromCharCode(index + 65)
        );
    使用...运算符

2. 数组遍历
    - 计数循环：这种形式可读性差，但性能好
        for(let i = 0; i < arr.length; i++){
            console.log(arr[i])
        }

    - forEach() 方法，对数组进行遍历，没有返回值。
        坑点在于forEach() **方法不能使用break和continue语句**，因为forEach() 方法是一个回调函数，它不是一个循环语句。
        arr.forEach((item,index) => {
            console.log(item,index)
        })

    - for...of 循环，对数组进行遍历，没有返回值。es6提供的新的循环方式，arr必须是可遍历的对象，
        for(let val of arr){ // val 为数组的元素
            console.log(val)
        }
        for(const [index,item] of arr.entries()){ // 使用entries() 方法，返回一个**数组的迭代器对象**，每一项包含数组的键值对 例如： [0,13] key value
            console.log(index,item)
        }

    - for...in 循环，对数组进行遍历，有返回值
        for(let key in arr){ // key 为数组的索引
            console.log(key,arr[key])
        }
    
    - reduce() 方法， 负责在繁杂的keys下产生唯一的value，并基于上一个状态进行计算
        const nums = [1,2,3,4,5]
        const sum = nums.reduce((pre,cur)=>{
            return pre+cur // pre 是上一次的计算结构
        })
        console.log(sum) // 15

    - map() 方法，对数组进行遍历，有返回值，返回一个新数组
    - filter() 方法，对数组进行遍历，有返回值，返回一个新数组

    - some() 方法，对数组进行遍历，有返回值，返回一个布尔值
    - every() 方法，对数组进行遍历，有返回值，返回一个布尔值
