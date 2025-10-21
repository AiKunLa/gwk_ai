
const obj = {
    name: 'obj',
    age: 18,
}

const arrow = () => console.log(this.name)

const  normal = function() {
    console.log(this.name)
}

arrow.call(obj) // undefined
normal.call(obj) // obj