import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from "../../types/todolListType";

const initialState: Todo[] = []

const todosSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodo: {
            reducer(state, action: PayloadAction<Todo>) {
                state.push(action.payload)
            },
            prepare(text: string) {
                const payload: Todo = {
                    id: Date.now(),
                    text,
                    completed: false
                }
                return { payload }
            }
        },
        toggleTodo(state, action: PayloadAction<number>) {
            const todo = state.find((todo) => todo.id === action.payload)
            if (todo) {
                todo.completed = !todo.completed
            }
        },

        deleteTodo(state, action: PayloadAction<number>) {
            return state.filter((todo) => todo.id !== action.payload)
        },

        editTodo(state, action: PayloadAction<{ id: number, text: string }>) {
            const { id, text } = action.payload
            const todo = state.find((todo) => todo.id === id)
            if (todo) {
                todo.text = text
            }
        }
    }
})

export const { addTodo, toggleTodo, deleteTodo, editTodo } = todosSlice.actions
export default todosSlice.reducer