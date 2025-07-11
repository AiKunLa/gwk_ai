function CreateCounter(num) {
  this.num = num;
  let count = 0;
  return { // 这样就创建了一个类，count是私有变量，name是公有变量
    name:'计数器',
    increment: () => {
      count++;
    },
    decrement: () => {
      count--;
    },
    getCount: () => {
      return count;
    },
  };
}


const obj = CreateCounter(1);
console.log(obj.getCount());

function Person(name,age){
  this.name = name;
  this.age = age;
}

const p1 = new Person('张三',18);
console.log(p1.name); // 张三
console.log(p1.age); // 18
