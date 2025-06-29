const arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  foo: 'bar'  // 非数值键
};
for(let key in arrayLike){
    console.log(key); // 0  1  2  length foo
}
