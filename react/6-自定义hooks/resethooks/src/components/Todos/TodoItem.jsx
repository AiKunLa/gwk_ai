const TodoItem = (props) => {
  const { todo, onChangeTodo ,onTodoDelete} = props;
  return (
    <>
      <li className="todo-item">
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={e=>onChangeTodo(todo.id)}
        />
        <span className={todo.isCompleted ? "complete" : ""}>{todo.title}</span>
        <button onClick={e => onTodoDelete(todo.id)}>删除</button>
      </li>
    </>
  );
};
export default TodoItem;
