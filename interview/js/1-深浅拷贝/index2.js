const target = {
    a:1
}

Object.assign(target,undefined)
Object.assign(target,null)
console.log(target); // {a:1}

Object.assign(undefined,target)