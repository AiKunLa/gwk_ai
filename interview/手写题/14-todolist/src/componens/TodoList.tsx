import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { addTodo, toggleTodo, deleteTodo, editTodo } from '../features/todos/todosSlice'
import type { Todo } from '../types/todolListType'

function TodoInput() {
    const [text, setText] = useState('')
    const dispatch = useDispatch()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!text.trim()) return
        dispatch(addTodo(text.trim()))
        setText('')
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a todo..."
            />
            <button type="submit">Add</button>
        </form>
    )
}

function TodoItem({ id, text, completed }: { id: number; text: string; completed: boolean }) {
    const [editing, setEditing] = useState(false)
    const [editText, setEditText] = useState(text)
    const dispatch = useDispatch()

    const handleEdit = () => {
        if (!editText.trim()) return
        dispatch(editTodo({ id, text: editText.trim() }))
        setEditing(false)
    }

    return (
        <li>
            <input
                type="checkbox"
                checked={completed}
                onChange={() => dispatch(toggleTodo(id))}
            />
            {editing ? (
                <>
                    <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                    <button onClick={handleEdit}>Save</button>
                </>
            ) : (
                <>
                    <span style={{ textDecoration: completed ? 'line-through' : 'none' }}>{text}</span>
                    <button onClick={() => setEditing(true)}>Edit</button>
                    <button onClick={() => dispatch(deleteTodo(id))}>Delete</button>
                </>
            )}
        </li>
    )
}

export function TodoList() {
    const todos = useSelector((state: RootState) => state.todos)

    return (
        <div>
            <h1>Todo List</h1>
            <TodoInput />
            <ul>
                {todos.map((todo: Todo) => (
                    <TodoItem key={todo.id} {...todo} />
                ))}
            </ul>
        </div>
    )
}
