import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/layout/MainLayout";
import { DashBoard } from "@/pages/dashboard/DashBoard";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: MainLayout,
        children: [
            {
                path: '/dashboard',
                Component: DashBoard
            },
            {
                
            }
        ]
    }
], {
    basename: '/'
})