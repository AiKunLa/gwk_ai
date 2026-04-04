import { Sidebar } from "@/layout/Sidebar";
import { Outlet } from "react-router-dom";

export function MainLayout() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white shadow flex items-center">
                    <h1 className="text-xl font-bold ml-4">Dashboard</h1>
                </header>

                <main className="flex-1 bg-gray-300">
                    <Outlet />
                </main>

                <footer className="h-12 bg-white border-t"></footer>

            </div>
        </div>
    )
}