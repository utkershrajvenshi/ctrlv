import styled from "styled-components";
import palette from "../../globalStyles/colorPalette"

export const HomeScreenWrapper = styled.div`
    height: 100vh;
`

export const BodyWrapper = styled.div`
    display: flex;
    height: 85%;
    background-color: ${props => palette[props.mode].secondary};
    flex-direction: column;
    justify-content: center;
    padding: 0 3em;
`