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

