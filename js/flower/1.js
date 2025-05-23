//声明了对象常量
//在内存中开辟了一个空间，里面存储了name、age、sayHello三个属性
//gwk 对应了一个地址
//变量名是地址的标记，指向了内存中存储的对象
// js是一种弱数据类型语言，java是强数据类型语言
// 当赋值之后才知道是什么数据类型
// 对象字面量 JSON ：从字面意义上便可以了解到该对象的一些属性和方法
// js 很灵活，不需要new，通过{}来创建对象
// {} 是一个对象的字面量

//继承 分装 多态 抽象

const person1 = {
    name: 'gwk1',
    age: 18,
    flower: 1,
    sendFlower:function(person2) {
        this.flower--;
        person2.flower++;
        console.log(`${this.name}给${person2.name}送了一朵花`);
    },
    receiveFlower:function() {
        this.flower++;
        console.log('gwk1 receiveFlower')
    }
}

const person2 = {
    name: 'gwk2',
    age: 19,
    flower: 2,
    sendFlower:function(person1) {
        this.flower--;
        person1.flower++;
        console.log(`${this.name}给${person1.name}送了一朵花`);
    },
    receiveFlower:function() {
        this.flower++;
        console.log('gwk2 receiveFlower')
    }
}

let main = function() {
    console.log(`${person1.name}有${person1.flower}朵花\n${person2.name}有${person2.flower}朵花\n`);
    console.log('开始送花 person1->perons2 \n');
    person1.sendFlower(person2);
    console.log(`${person1.name}有${person1.flower}朵花\n${person2.name}有${person2.flower}朵花`); 
}
main();