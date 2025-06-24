
function fn(){
    var n = 100
    function fun(){
        console.log(n)
    }
    return fun
}
var res = fn()
res()
