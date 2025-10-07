let a:unknown // 表示未知类型，所以不能使用类型的方法，需要进行类型断言 或判断后才能使用
a=13
a='13'

if(typeof a === 'number') {
    a.toFixed()
}

if(typeof a === 'string') {
    a.split('')
}

