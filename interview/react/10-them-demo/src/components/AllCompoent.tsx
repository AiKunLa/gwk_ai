import { useTheme } from "../hooks/useTheme";

export function ThemeButton() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                color: '#fff',
                backgroundColor: theme.color,
                border: theme.border,
                padding: '10px 24px',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
            }}
        >
            切换到 {theme.type === 'light' ? '深色' : '浅色'} 主题
        </button>
    );
}



export function ThemeInfo() {
    const { theme } = useTheme();

    return (
        <div
            style={{
                marginTop: 20,
                padding: 16,
                background: theme.background,
                border: theme.border,
                borderRadius: 8,
                color: theme.type === 'light' ? '#333' : '#eee',
                transition: 'all 0.3s',
            }}
        >
            <p><strong>当前主题：</strong>{theme.type === 'light' ? '浅色 ☀️' : '深色 🌙'}</p>
            <p><strong>主色值：</strong>{theme.color}</p>
        </div>
    );
}