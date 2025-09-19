import service from "./request";

export const login = (data: { username: string; password: string }) => {
    return service.post('/login',data)
};
