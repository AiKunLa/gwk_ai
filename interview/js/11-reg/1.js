var str = 'abc345efgabcad';
var reg = str.replace(/[abc]/g, '');

console.log(reg);

console.log(str.replace(/\d+/g,(mach)=>{
    return `[${mach}]`
}))

console.log(str.replace(/\d+/g,(match)=>{
    return parseInt(match)*2
}))