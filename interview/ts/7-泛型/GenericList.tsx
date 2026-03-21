// 定义一个泛型组件，接收任意类型的数据列表

interface ListProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
}

function GenericList<T>({ items, renderItem }: ListProps<T>) {
    return (
        <ul>
            {
                items.map((item, index) => (
                    <li key={index}>{renderItem(item)}</li>
                ))
            }
        </ul>
    )
}