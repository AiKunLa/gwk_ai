function foo() {
    // 
    var myName = "极客时间"
    let test1 = 1
    const test2 = 2
    var innerBar = {
        getName:function(){
            console.log(test1)
            return myName
        },
        setName:function(newName){
            myName = newName
        }
    }
    return innerBar
}
var bar = foo() // 函数嵌套函数，外部访问的时候，会沿着词法作用域链查找它声明时候的函数变量
// 函数就好像由一个背包一样，里面有很多变量
// foo执行后，会将foo的自由变量都放入背包中，然后返回一个函数，这个函数就是innerBar
// 
bar.setName("极客邦")
bar.getName()
console.log(bar.getName())