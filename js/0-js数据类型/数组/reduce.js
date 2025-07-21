const nums = Array.from(new Array(50),(item,index)=>{
    return Math.floor(Math.random()*100)
})

const sum = nums.reduce((pre,cur)=>{
    return pre+cur
})

console.log(sum)