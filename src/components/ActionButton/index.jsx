import React, { useContext } from "react";
import { LightDarkThemeContext } from "../../context/LightDark/LightDarkContext";
import { ButtonWrapper, PrimaryButtonWrapper, SecondaryButtonWrapper } from "./ActionButton.styles";

export const ActionButton = ({ buttonType="secondary", label }) => {
    const { theme } = useContext(LightDarkThemeContext)
    const isButtonPrimary = buttonType==="primary"
    
    return (
        <ButtonWrapper>
            { isButtonPrimary
            ? <PrimaryButtonWrapper mode={theme}>{label}</PrimaryButtonWrapper>
            : <SecondaryButtonWrapper mode={theme}>{label}</SecondaryButtonWrapper>
            }
        </ButtonWrapper>
    )
}