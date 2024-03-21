import React, { FunctionComponent } from 'react';
import { Message } from '../../../classes';
import { useUser } from '../../../hooks';
import { Box, Button, Grid, Paper, SxProps, Typography } from "@mui/material";
import { CHATBOT_NAME } from '../../../constants';
import { MessageInfo } from './MessageInfo';

interface IProps {
    message: Message;
    replyClick: (message: Message) => void;
};

const ChatMessage: FunctionComponent<IProps> = ({
    message,
    replyClick
}) => {
    const { user } = useUser();
    
    if (!user) {
        return null;
    }

    const {
        senderUserId,
        senderUsername,
        content,
        isAnswered,
        isReplyTo
    } = message;

    let messageJustification;
    let messagePaperStyles: SxProps = {
        
    };
    let replyToVisible = !Boolean(isReplyTo) && !isAnswered;

    if (senderUsername === CHATBOT_NAME) {
        messageJustification = 'flex-start';
        messagePaperStyles = {
            backgroundColor: 'warning.main',
            color: 'text.main',
            borderColor: 'warning.main',
        };
    } else if (senderUserId === user?.id) {
        messageJustification = 'flex-end';
        messagePaperStyles = {
            backgroundColor: 'primary.main',
            color: '#FFF',
            borderColor: 'primary.main',
        };
        replyToVisible = false;
    } else {
        messageJustification = 'flex-start';
        messagePaperStyles = {
            borderColor: 'primary.main',
        };
    }

    return (
        <Grid justifySelf={messageJustification} item xs={8}>
            <MessageInfo username={senderUsername} timestamp={message.sent} />
            <Paper
                sx={messagePaperStyles}
            >
                {isReplyTo &&
                    <Box display="block" sx={{ marginBottom: '4px'}}>
                        <Typography sx={{ fontStyle: 'italic' }} variant="caption">
                            Replying To: {isReplyTo.content}
                        </Typography>
                    </Box>
                }
                <Box>
                    {content}
                </Box>
            </Paper>
            {replyToVisible && (
                <Box display="block" sx={{ textAlign: 'right' }}>
                    <Button variant="text" onClick={() => replyClick(message)}>
                        Answer this
                    </Button>
                </Box>
            )}
        </Grid>
    );
};

export { ChatMessage };