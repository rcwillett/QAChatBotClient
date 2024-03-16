import React, { FunctionComponent } from 'react';
import { Chat } from '../components';
import { Title } from '@mui/icons-material';

const ChatPage: FunctionComponent = () => {
    return (
        <div>
            <Title component="h1">QA Chat Page</Title>
            <Chat />
        </div>
    )
};

export { ChatPage };