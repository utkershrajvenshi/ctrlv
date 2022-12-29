import styled from "styled-components";
import palette from "../../globalStyles/colorPalette";

export const ProjectTextWrapper = styled.p`
    font-weight: 600;
    font-size: 40px;
    color: ${props => palette[props.mode].primary};
`