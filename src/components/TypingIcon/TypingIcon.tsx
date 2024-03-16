import { Box } from "@mui/material";
import { FunctionComponent } from "react";
import './styles.css';

interface iProps {
    size?: number;
}

const TypingIcon: FunctionComponent<iProps> = ({ size }) => {
    const iconSize = size || 12;
    return (
        <Box display="flex" alignItems="center" sx={{ padding: '2px' }}>
            <div style={{ height: iconSize, width: iconSize }} className="typingDot typingDotOne" />
            <div style={{ height: iconSize, width: iconSize }} className="typingDot typingDotTwo" />
            <div style={{ height: iconSize, width: iconSize }} className="typingDot typingDotThree" />
        </Box>
    )
}

export { TypingIcon };