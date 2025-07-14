# 1-React中的{}
是什么：{}是react中的表达式，不是语句，其执行结果会被react渲染到页面中
作用：
    1. 嵌入js表达式
    2. 传值
        组件之间传递
        function eat(food){
            return '我吃了'+food
        }
        const obj = {
            name:'张三',
            age:18,
        }
        <>
            <User name={obj.name} age={obj.age} eat={eat} />
        </>

        当你想把一个字符串属性传递给 JSX 时，把它放到单引号或双引号中
        const name = 'Gregorio Y. Zara';
        const element = <h1>Hello, {name}</h1>;

        当传递的是一个对象时，需要用花括号包裹它，就像传递一个字符串一样
            const person = {
            name: '张三',
            theme: {
                backgroundColor: 'black',
                color: 'pink'
            }
            };
            const element = (
            <div style={person.theme}>
                <h1>Hello, {person.name}</h1>
            </div>
            );
    3. 渲染动态样式
        需要使用两个花括号{{}}
        <div style={{color:'red',fontSize:16}}>jjajdo</div>
    4. 动态渲染列表
        const todos = {1:'学习react',2:'学习vue',3:'学习angular'}
        <ul>
            {
                todos.map((item,index)=>({
                    <li key={index}>{item}</li>
                }))
            }
        </ul>
    5. 条件渲染
        let tager = false
        {tager? <Uer />} 当tager为true时组件User才会 渲染
    


    


# 2-Propos
