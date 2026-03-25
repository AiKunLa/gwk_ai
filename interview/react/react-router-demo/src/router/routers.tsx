import { type RouteObject } from 'react-router';
import { AppLayout } from '../components/layout/app-layout';

export const routes: RouteObject[] = [
    {
        path: '/',
        Component: AppLayout,
        children: [
            {index:true,Component:}
        ]
    }
]