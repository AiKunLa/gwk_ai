//
let sy1 = Symbol.for("name");
let sy2 = Symbol.for("name");
console.log(sy1 === sy2); // true

let sy3 = sy2;
console.log(sy3 === sy2); // true

const sym1 = Symbol.for("id");
const sym2 = Symbol("id");
const sym3 = Symbol.for("id");
console.log("id:" + sym1.description);

console.log(sym1 === sym2); // false
console.log(sym1 === sym3); // true


console.log(typeof Symbol.keyFor(sym1)); // id
console.log(Symbol.keyFor(sym2)); // undefined

const re = Symbol.keyFor(sym1)
console.log(typeof re) // string