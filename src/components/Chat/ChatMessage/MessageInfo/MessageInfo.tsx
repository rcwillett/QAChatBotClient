import { Box, Typography } from "@mui/material";
import react, { FunctionComponent } from "react";

interface IProps {
    username: string;
    timestamp?: Date;
};

const MessageInfo: FunctionComponent<IProps> = ({ username, timestamp }) => {
    const infoFontSize = '0.75rem';
    return (
        <Box sx={{ display: 'inline-flex', width: '100%', justifyContent: 'space-between' }}>
            <Typography sx={{fontSize: infoFontSize, fontWeight: 700, paddingRight: 1 }}>
                {username}
            </Typography>
            {timestamp && (
                <Typography sx={{ fontSize: infoFontSize }}>
                    {timestamp.toLocaleTimeString()}
                </Typography>
            )}
        </Box>
    );
};

export { MessageInfo };