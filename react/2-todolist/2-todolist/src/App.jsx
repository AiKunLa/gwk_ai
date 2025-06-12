
import TodoList from './component/TodoList';
import TodoFrom from './component/TodoFrom';
import './App.css';

function App() {
    return (
        <div className="App">
            <h1>React Move</h1>
            {/* 选项框 */}
            <TodoList /> {/* 添加 TodoList 组件 */}
        </div>
    );
}

export default App;