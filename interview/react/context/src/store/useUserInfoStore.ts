import { create } from "zustand";


interface UserInfo {
    name: string;
    age: number;
}

interface UserInfoStore {
    userInfo: UserInfo;
    setUserInfo: (userInfo: UserInfo) => void;
}

export const useUserInfoStore = create<UserInfoStore>((set) => ({
    userInfo: {
        name: "",
        age: 0,
    },
    setUserInfo: (userInfo) => set({ userInfo }),
}))