// 提供精准的状态管理
const repoReducer = (state, actions) => {
    switch (actions.type){
        // 开始获取数据
        case "FETCH_STARE":
            return {
                ...state,
                loading: true,
                error: null,
            };
        // 数据获取成功
        case "FETCH_SUCCESS":
            return {
                ...state,
                repos: actions.payload,
                loading: false,
                error: null,
            };
        // 数据获取失败
        case "FETCH_ERROR":
            return {
                ...state,
                repos: [],
                loading: false,
                error: actions.payload,
            };
        default:
            return state;
    }
};
export default repoReducer;
