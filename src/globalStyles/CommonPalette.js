import { useContext } from 'react'
import { LightDarkThemeContext } from '../context/LightDark/LightDarkContext'
import palette from './colorPalette'

export const CommonPalette = () => {
    const { theme } = useContext(LightDarkThemeContext)
    return palette[theme]
}