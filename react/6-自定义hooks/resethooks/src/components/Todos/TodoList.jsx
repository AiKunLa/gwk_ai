import TodoItem from "./TodoItem";

const TodoList = (props) => {
  const { todos, onChangeTodo ,onTodoDelete} = props;
  return (
    <ul className="todo-list">
      {todos.length > 0 ? (
        todos.map((todo) => (
          <TodoItem todo={todo} key={todo.id} onChangeTodo={onChangeTodo} onTodoDelete={onTodoDelete} />
        ))
      ) : (
        <div>暂无数据</div>
      )}
    </ul>
  );
};

export default TodoList;
