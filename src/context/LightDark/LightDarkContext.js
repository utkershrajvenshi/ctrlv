
import { useState, createContext } from "react";

const LightDarkThemeContext = createContext({
    theme: 'dark',
    toggleTheme: () => {},
})

const LightDarkThemeProvider = ({children}) => {
    const [theme, setTheme] = useState('dark')
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    return (
        <LightDarkThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </LightDarkThemeContext.Provider>
    )
}
export { LightDarkThemeContext, LightDarkThemeProvider }