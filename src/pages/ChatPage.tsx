import React, { FunctionComponent } from 'react';
import { Chat } from '../components';
import { Typography } from '@mui/material';

const ChatPage: FunctionComponent = () => {
    return (
        <div>
            <Typography component="h1">QA Chat Page</Typography>
            <Chat />
        </div>
    )
};

export { ChatPage };