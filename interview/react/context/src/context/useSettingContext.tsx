import React, { createContext, useState } from "react";

interface SettingContextType {
    theme: string;
    toggleTheme: () => void;
}

export const SettingContext = createContext<SettingContextType>({
    theme: "light",
    toggleTheme: () => { },
});

export const SettingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <SettingContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </SettingContext.Provider>
    );
}

