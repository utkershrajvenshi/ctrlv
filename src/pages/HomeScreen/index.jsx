import React, { useContext } from "react";
import { LightDarkThemeContext } from "../../context/LightDark/LightDarkContext";
import { Header } from "../../components/Header";
import { BodyWrapper, HomeScreenWrapper } from "./HomeScreen.styles";
import { WeightedText } from "../../components/WeightedText";

export const HomeScreen = () => {
    const { theme } = useContext(LightDarkThemeContext)
    const mainHighlightText = 'Create anywhere available clipboards within seconds for increased productivity across teams'
    return (
        <HomeScreenWrapper>
            <Header />
            <BodyWrapper mode={theme}>
                <WeightedText weight="600" size="25px" value={mainHighlightText} />
            </BodyWrapper>
        </HomeScreenWrapper>
    )
}