
import {
    LayoutDashboard,
    Users,
    Settings,
    HelpCircle,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface NavItem {
    path: string
    icon: typeof LayoutDashboard
    label: string
}

const navItems: NavItem[] = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Users' },
]

const bottomItems: NavItem[] = [
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/help', icon: HelpCircle, label: 'Help' },
]

export function Sidebar() {
    return (
        <aside className="flex flex-col h-screen w-64 bg-white border-r border-slate-200">
            {/* Logo */}
            <header className="flex items-center h-16 px-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">M</span>
                    </div>
                    <h1 className="text-base font-semibold text-slate-900">MyApp</h1>
                </div>
            </header>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <p className="px-3 mb-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Main Menu
                </p>
                {navItems.map(({ path, icon: Icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === '/dashboard'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <Icon size={20} className="shrink-0" />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Navigation */}
            <div className="px-3 py-4 border-t border-slate-100">
                <div className="space-y-1">
                    {bottomItems.map(({ path, icon: Icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`
                            }
                        >
                            <Icon size={20} className="shrink-0" />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </aside>
    )
}