import styled from "styled-components";
import palette from "../../../globalStyles/colorPalette";

const mode = 'light'

export const ManageClipboardsWrapper = styled.div`
    width: 500px;
    height: 680px;
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    padding: 37px 52px;
    align-items: stretch;
`

export const TitleWrapper = styled.p`
    font-weight: 600;
    color: ${palette[mode].primary};
    margin-bottom: 37px;
    text-align: start;
`

export const ClipboardsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
`

export const IndividualClipboard = styled.div`
    border-radius: 8px;
    color: ${palette[mode]}
`