import React, { useContext } from "react"
import { LightDarkThemeContext } from "../../context/LightDark/LightDarkContext";
import { WeightedTextWrapper } from "./WeightedText.styles";

export const WeightedText = ({ weight, size, value }) => {
    const { theme } = useContext(LightDarkThemeContext)
    return (
        <WeightedTextWrapper weight={weight} mode={theme} size={size} >{value}</WeightedTextWrapper>
    )
}