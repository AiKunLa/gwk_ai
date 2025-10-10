const arr = Array.from({length:10},(_,i)=>i);
console.log(arr);

if(arr.includes(5)){
    console.log('includes 5')
}

const p = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('success')
    },1000)
})
