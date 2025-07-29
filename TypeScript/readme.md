# TypeScript
由于js是一种弱类型语言，在大型项目中，类型错误会导致很多问题，比如在使用map时，可能会因为类型错误而导致程序崩溃。
ts会在编译阶段检查类型错误，在编译阶段就会报错，而不是在运行时才报错。

typeScript 类型约束 

1. 泛型
    ```js
    function identity<T>(arg: T): T {
        return arg;
    }
    ```
    三个T表示的不同含义
    - 第一个T是表示的是泛型参数，是一个占位符。当我们这样调用
        ```js
        identity<string>("hello")
        ```
        这里的string就会替换掉所有的T，使得函数可以适用于多种类型，而不是固定在某一种类型上
    - 第二个T是表示的是返回值的类型
    - 第三个T是表示的是参数的类型

2. 使用ts 实现父子组件的通信
    通过ts来约束 父子组件传递的参数类型，以及传递的函数接收的参数类型
    子组件
    ```js
    interface NameEditComponentProps {
      username:string;
      onChange:(event:React.ChangeEvent<HTMLInputElement>) => void;
    }
    const NameEditComponent: React.FC<NameEditComponentProps> = (props) => {
      return (
        <>
          <label>change</label>
          <input type="text" value={props.username} onChange={props.onChange}/>
        </>
      )
    }
    ```
    父组件
    ```js
    const setUsernameState = (event:React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value)
    }
    // 使用泛型 约束参数类型以及返回值
    const [name,setName] = useState<string>("张三")
    return (
        <>
            <h1>Hello TypeScript</h1>
            <h2>{name}</h2>
            <NameEditComponent username={name} onChange={setUsernameState} />
        </>
    )
    ```