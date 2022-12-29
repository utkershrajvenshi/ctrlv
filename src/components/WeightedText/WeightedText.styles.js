import styled from "styled-components";
import palette from "../../globalStyles/colorPalette";

export const WeightedTextWrapper = styled.p`
font-weight: ${props => props.weight};
font-size: ${props => props.size};
color: ${props => palette[props.mode].primary};
`