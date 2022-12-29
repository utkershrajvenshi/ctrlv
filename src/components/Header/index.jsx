import React, { useContext } from "react";
import { HeaderWrapper } from "./Header.styles";
import { ProjectText } from '../ProjectText'
import { ActionButton } from "../ActionButton";
import { ThemeToggleButton } from "../ThemeToggleButton";
import { LightDarkThemeContext } from "../../context/LightDark/LightDarkContext";

export const Header = () => {
    const { theme } = useContext(LightDarkThemeContext)
    return (
        <HeaderWrapper mode={theme}>
            <ProjectText />
            <ThemeToggleButton />
            <ActionButton label="Create a Board" buttonType="primary" />
            <ActionButton label="Sign In" buttonType="secondary" />
        </HeaderWrapper>
    )
}