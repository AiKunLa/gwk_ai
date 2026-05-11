
import React, { createContext, useState } from 'react';



const theme = { //主题颜色
    dark: {
        color: '#1890ff',
        background: '#1890ff',
        border: '1px solid blue',
        type: 'dark',
    },
    light: {
        color: '#fc4838',
        background: '#fc4838',
        border: '1px solid pink',
        type: 'light',
    },
}

const ThemeContext = createContext<{
    theme: typeof theme.light,
    toggleTheme: () => void,
}>({
    theme: theme.light,
    toggleTheme: () => { },
});


// ✅ 导出 Context，子组件才能 useContext(ThemeContext)
export { ThemeContext };

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [currentTheme, setCurrentTheme] = useState(theme.light);
    const toggleTheme = () => {
        setCurrentTheme(currentTheme.type === 'light' ? theme.dark : theme.light);
    }
    return (
        <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}