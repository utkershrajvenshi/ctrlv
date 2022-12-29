import styled from "styled-components";
import palette from "../../globalStyles/colorPalette";

const ThemeToggleWrapper = styled.button`
border-radius: 50%;
width: 50px;
height: 50px;
background: rgba(205,205,205,0.2);
border: none;
font-size: 2em;
`

const ToggleIcon = styled.i`
color: ${props => palette[props.theme].primary}
`

export { ThemeToggleWrapper, ToggleIcon }