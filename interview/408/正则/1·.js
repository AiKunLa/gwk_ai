const str = '我的手机和13958446250'
const reg = /1[3-9][0-9]{9}/
console.log(reg.test(str))

console.log(str.match(reg))

const str3 = 'myfa{name}'
str3.replace(/\{name\}/,"小明")
console.log(str3)