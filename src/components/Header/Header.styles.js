import styled from "styled-components";
import palette from "../../globalStyles/colorPalette";

export const HeaderWrapper = styled.div`
    padding: 0 75px;
    height: 15%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${props => palette[props.mode].primary};
    background-color: ${props => palette[props.mode].secondary};
`