import { useTodoContext } from "../../../hoosk/useTodoContext";
function TodoItem() {
  const { todos, deleteList, changeCompleted } = useTodoContext();
  return (
    <ul>
      {todos.map((item) => {
        // 数据驱动界面  数据变化界面会变化
        return (
          <li key={item.id} style={{ textDecoration: item.completed ? "line-through" : "none" }}>
            {item.container}
            <input type="checkbox" checked={item.completed} 
            onChange={() => changeCompleted(item.id)}
            />
            <button onClick={() => deleteList(item.id)}>删除</button>
          </li>
        );
      })}
    </ul>
  );
}

export default TodoItem;
