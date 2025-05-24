/**
 * @func 反转字符串
 * @param {String} str 
 * @return {String}
 */
function reverseString(str) {

    // js中字符串是一个简单数据类型（primitive），为什么可以使用split()方法？
    // 

    // 方法一 111-222-333-444
    // split() 返回一个数组对象，若传入空字符，则会按字符分割
    // reverse() 反转数组元素，它是通过交换数组元素的位置来实现的
    // join() 将数组元素组合成字符串，它是通过字符串拼接来实现的
    return str.split('').reverse().join('')
}
