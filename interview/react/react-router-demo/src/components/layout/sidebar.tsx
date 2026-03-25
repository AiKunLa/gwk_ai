import { NavLink } from "react-router";

interface NavItem {
    path: string;
    label: string
}


const navItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
]


export function Sidebar() {
    return (
        <aside>
            <div>
                <nav>
                    {
                        navItems.map(({ path, label }) => (
                            <NavLink key={path} to={path} end={path === '/'}>
                                <span>{label}</span>
                            </NavLink>
                        ))
                    }
                </nav>
            </div>
        </aside>
    )
}