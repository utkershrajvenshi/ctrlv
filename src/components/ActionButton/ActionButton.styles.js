import styled from "styled-components";
import palette from "../../globalStyles/colorPalette";

export const ButtonWrapper = styled.div`
    border-radius: 16px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
`

export const PrimaryButtonWrapper = styled(ButtonWrapper)`
    padding: 20px 25px;
    background-color: ${props => palette[props.mode].primary};
    border: none;
    color: ${props => palette[props.mode].secondary};
`

export const SecondaryButtonWrapper = styled(ButtonWrapper)`
    padding: 20px 25px;
    border: 1px solid;
    background-color: ${props => palette[props.mode].secondary};
    color: ${props => palette[props.mode].primary};
`