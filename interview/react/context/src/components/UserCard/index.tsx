import { useUserInfoStore } from "../../store/useUserInfoStore";
import { useContext } from "react";
import { SettingContext } from "../../context/useSettingContext";

export default function UserCard() {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const context = useContext(SettingContext);

    return (
        <div>
            <h2>User Card</h2>
            <p>Name: {userInfo.name}</p>
            <p>Age: {userInfo.age}</p>
            <button onClick={() => setUserInfo({ name: "John Doe", age: 30 })}>change</button>

            <p>Current Theme: {context.theme}</p>
            <button onClick={context.toggleTheme}>Toggle Theme</button>
        </div>
    )
}