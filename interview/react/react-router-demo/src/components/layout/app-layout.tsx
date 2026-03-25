import { Sidebar } from "./sidebar";
import { Outlet } from "react-router";

export function AppLayout() {
    return (
        <div>
            <Sidebar />
            <main>
                <div>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}