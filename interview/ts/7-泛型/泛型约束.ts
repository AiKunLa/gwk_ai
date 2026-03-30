// 想要对泛型进行约束 可以使用 extends 关键字来约束泛型的类型
// 例如我们想要约束泛型 T 必须是一个对象类型，可以这样写：
interface Lengthwise {
    length: number;
}

function LoggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length); // 现在我们可以安全地访问 length 属性了
    return arg;
}

