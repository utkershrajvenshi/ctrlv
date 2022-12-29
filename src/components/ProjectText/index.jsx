import React, { useContext } from "react";
import { ProjectTextWrapper } from "./ProjectText.styles";
import { LightDarkThemeContext } from "../../context/LightDark/LightDarkContext";

export const ProjectText = () => {
    const { theme } = useContext(LightDarkThemeContext)
    return (
        <ProjectTextWrapper mode={theme}>CtrlV</ProjectTextWrapper>
    )
}