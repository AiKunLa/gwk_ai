function getTypeOf(value){
    if(value === null){
        return value + ''
    }

    if(typeof value === 'object'){
        let valueClass = Object.prototype.toString.call(value)
        const type = valueClass.split(' ')[1].split('')
        type.pop()
        return type.join('').toLowerCase()
    } else {
        return typeof value
    }
}

console.log(getTypeOf(null))

console.log(getTypeOf(4))

console.log(getTypeOf([]))

console.log(Object.prototype.toString.call([]))

console.log(Object.prototype.toString.call(7))