# 受控组件与非受控组件
- 用于表单，收集用户数据
    - 受state 控制
        受控组件是指表单元素的值由React状态(state)控制，并通过事件处理程序同步更新的组件。
        这个会频繁的触发setState，可以实时检测用户输入（在这个阶段可以做一些校验），但是会导致性能问题。
        每次用户输入都会触发setState，导致组件重新渲染，影响性能。 可以使用防抖节流来优化性能，这里使用防抖。
        ```jsx
            const [value, setValue] = useState('');
            <>
                <input value={value} onChange={(e) => setValue(e.target.value)} />
            </>
        ```
    - 非受控
        非受控组件是指表单数据由DOM本身处理，而不是由React状态控制的组件。
        对于表单交互没有那么强的场景，使用非受控组件会更简单。
        ```jsx
            const inputRef = useRef(null);
            const handleSubmit = (e) => {
                e.preventDefault();
                onSubmit(inputRef.current.value);
            };
            <>
                <input ref={inputRef} />
                <button type="submit" onClick={handleSubmit}>提交</button>
            </>
        ```



