import React, { useContext } from "react"
import { LightDarkThemeContext } from "../../context/LightDark/LightDarkContext"
import { ThemeToggleWrapper, ToggleIcon } from "./ThemeToggleButton.styles"

export const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useContext(LightDarkThemeContext)
    const iconClassname = theme === 'light' ? 'bi-sun-fill' : 'bi-sun'
    return (
        <ThemeToggleWrapper onClick={toggleTheme} >
            <ToggleIcon className={`bi ${iconClassname}`} theme={theme}/>
        </ThemeToggleWrapper>
    )
}