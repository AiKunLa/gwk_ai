interface ApiResponse {
    code: number;
    message: string;
}

interface UserResponse extends ApiResponse {
    data: {
        id: number;
        username: string;
    };
}
// 优点：如果不小心把 code 改成了 string，立刻报错，防止 API 契约破裂。


interface ApiReuest {
    method: string
    url: string
    body?: object
    headers?: object
}

interface UserRequest extends ApiReuest {
    data: {
        username: string
        password: string
    }
}


// 基础 Props
type BaseProps = {
    className?: string;
    style?: React.CSSProperties;
};

// 可点击功能
type ClickableProps = {
    onClick: () => void;
    disabled?: boolean;
};

// 可拖拽功能
type DraggableProps = {
    onDragStart: () => void;
};

// 组合：一个组件同时具备 基础+点击+拖拽
type ComplexButtonProps = BaseProps & ClickableProps & DraggableProps;

// 甚至可以组合联合类型
type Status = 'loading' | 'success';
type LoadingState = { status: 'loading', progress: number };
type SuccessState = { status: 'success', data: any };

// 交叉类型在这里很难用，通常用 联合类型 (|)
// 但如果是给每个状态都加上通用 ID：
// | 是联合类型运算符，表示“或”：取值可以是 LoadingState 或 SuccessState 中的任意一种
type StateWithId = (LoadingState | SuccessState) & { requestId: string };
// 结果：(LoadingState & {requestId}) | (SuccessState & {requestId})
// 这种复杂的类型运算只有 type & 能做到。
