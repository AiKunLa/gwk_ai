# map
- 在js中，map方法是一个函数，用于遍历数组中的每个元素，并对每个元素进行指定的操作，然后返回一个新的数组。
- map方法可以传递一个回调函数作为参数，回调函数的参数分别为当前元素、当前元素的索引和数组本身。

## const arr = ['1', '2', '3'].map(parseInt) // 为什么结果是[1, NaN, NaN]
- 解析： 
  - parseInt是一个函数，用于将字符串转换为整数。 
  - 当parseInt的第二个参数为0时，会将字符串解析为十进制整数。
  - 当parseInt的第二个参数不为0时，会将字符串解析为指定进制的整数。 进制的范围是2-36。
  - map方法会遍历数组中的每个元素，并将每个元素作为parseInt的第一个参数，第二个参数为索引，第三个参数为数组本身。
  - 所以，arr[0]会被解析为parseInt('1', 0)，结果为1。 // 第二个参数为0，会将字符串解析为十进制整数。
  - arr[1]会被解析为parseInt('2', 1)，结果为NaN。 // 第二个参数为1，会将字符串解析为1进制的整数，1进制的整数范围是0-1，2 超过了，所以结果为NaN。
  - arr[2]会被解析为parseInt('3', 2)，结果为NaN。 // 第二个参数为2，会将字符串解析为2进制的整数，2进制的整数范围是0-1，3 超过了，所以结果为NaN。
  - 所以，arr的结果为[1, NaN, NaN]。
  - 所以，arr的结果为[1, NaN, NaN]。

## 如何让输出结果为[1, 2, 3]
- 解析：
  - map 三个参数 
    - currentValue：当前元素的值。
    - index：当前元素的索引。
    - array：当前元素所属的数组对象。
  - 若只传递一个参数，map方法会将当前元素的值作为回调函数的第一个参数，将当前元素的索引作为回调函数的第二个参数，将数组本身作为回调函数的第三个参数。
  - 当传递的是一个函数时，map方法会将这个函数作为回调函数，会将map中的参数全部传递给这个函数。
  - 可以使用map方法的第二个参数，将map方法的回调函数的this指向数组本身。 
  - 所以，arr[0]会被解析为parseInt('1', 0, arr)，结果为1。 

  - 代码：
    ```js
    const arr = ['1', '2', '3'].map(parseInt, arr) // map方法的第二个参数是
    ```
    

