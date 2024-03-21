import { v4 as uuidv4 } from 'uuid';
import { Box, Button, FormControl, FormHelperText, Grid, Paper, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, FunctionComponent, useEffect, useRef, useState } from "react";
import { useChatService, useUser } from "../../hooks";
import { ErrorMessage } from "../ErrorMessage";
import { Message } from '../../classes';
import { Loader } from "../Loader";
import { Close } from '@mui/icons-material';
import { ChatMessage } from './ChatMessage';

interface iProps {}

const resetTitle = () => {
    document.title = 'Forum Chat Room';
};

let resetTitleTimeout: NodeJS.Timeout | undefined;

const Chat: FunctionComponent<iProps> = () => {
    const { user } = useUser();

    const [replyToMessage, setReplyToMessage] = useState<Message>();
    const [message, setMessage] = useState<string>('');
    const [messageError, setMessageError] = useState<string>('');
    const [initialLoad, setInitialLoad] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [criticalError, setCriticalError] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const chatWindowRef = useRef<HTMLDivElement>(null);

    const handleNewMessage = (newMessage: Message) => {
        if (newMessage != null) {
            setMessages((currentMessages) => {
                if (typeof newMessage.sent === 'string'){
                    newMessage.sent = new Date(newMessage.sent);
                }
                const updatedMessages = [...currentMessages, newMessage];
                if (newMessage.isReplyTo) {
                    updatedMessages.find((message) => {
                        if (message.id === newMessage.isReplyTo?.id) {
                            message.isAnswered = true;
                            return true;
                        }
                    });
                }
                return updatedMessages;
            });
            document.title = 'New Message!';
            clearTimeout(resetTitleTimeout);
            resetTitleTimeout = setTimeout(resetTitle, 5000);
        }
    };

    const handleConnectionError = () => {
        setCriticalError(true);
    }

    const { sendMessage: sendMessageToApi } = useChatService({
        messageHandler: handleNewMessage,
        errorHandler: handleConnectionError
    });

    const onInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        let newMessage = e.target.value;
        setMessage(newMessage);
        if (newMessage.length > 500) {
            setMessageError('Your message is greater than 500 characters. Please reduce it to 500 characters!');
            return;
        } else if (messageError) {
            setMessageError('');
        }
    };

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();
        let messageToSend = message;
        try {
            if (!user) {
                throw new Error('No user account found! Please refresh the page to try again!');
            }
            setLoading(true);
            const newMessage = new Message(uuidv4(), user.id, user.name, new Date(), messageToSend, false, replyToMessage);
            await sendMessageToApi(newMessage);
            setLoading(false);
            setMessages((currentMessages) => {
                const updatedMessages = [...currentMessages, newMessage];
                if (newMessage.isReplyTo) {
                    updatedMessages.find((message) => {
                        if (message.id === newMessage.isReplyTo?.id) {
                            message.isAnswered = true;
                            return true;
                        }
                    });
                }
                return updatedMessages;
            
            });
            setMessage('');
            setMessageError('');
            setReplyToMessage(undefined);
            window.requestAnimationFrame(() => {
                const messageInput = document.getElementById('message');
                messageInput?.focus();
            });
        } catch (error: any) {
            setLoading(false);
            setMessage(messageToSend);
            if (error.message) {
                setMessageError(error.message);
            } else {
                setMessageError('Unknown error! Please try sending again!');
            }
        }
    };

    const getChatInitialState = async () => {
        document.title = 'Welcome to Forum Chat!';
        resetTitleTimeout = setTimeout(resetTitle, 5000);
        setInitialLoad(false);
    };

    const handleReplyClick = (message: Message) => {
        setReplyToMessage(message);
        const messageInput = document.getElementById('message');
        messageInput?.focus();
    };

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        getChatInitialState();
    }, [])

    if (criticalError || !user) {
        return (
            <Grid container spacing={3} justifyContent="center" flexDirection="column">
                <Grid item>
                    <ErrorMessage message="There was a critical error. Please refresh the page to try entering the chat again." />
                </Grid>
            </Grid>
        );
    }

    if (initialLoad) {
        return (
            <Grid container display="grid" justifyContent="center" spacing={2}>
                <Grid item>
                    <Loader />
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container sx={{ border: '1px solid #222', borderRadius: 3, overflow: 'hidden', height: 'auto' }}>
            <Grid
                container
                item
                display="grid"
                spacing={2}
                sx={{ height: '65vh', overflow: 'auto', alignContent: 'flex-start'}}
                ref={chatWindowRef}
                mt={0}
                p={1}
            >
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            backgroundColor: 'warning.main',
                            color: 'text.main',
                            borderColor: 'warning.main',
                            textAlign: 'center',
                            fontWeight: 700,
                        }}
                    >
                        Welcome to the Forum chat room! Please be respectful and have fun!
                    </Paper>
                </Grid>
                {messages.map((message) => <ChatMessage key={message.id} message={message} replyClick={handleReplyClick} />)}
            </Grid>
            <Grid container display="flex" p={1}>
                <Grid item xs={12}>
                    {replyToMessage && (
                        <Box pb={0.5}>
                            <Paper
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: 'primary.light',
                                    color: 'text.main',
                                    borderColor: 'primary.main',
                                    borderWidth: '2px',
                                    padding: 1,
                                    whiteSpace: 'pre-line', 
                                }}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                    Replying to:
                                </Typography>
                                <Typography variant="body2">
                                    {replyToMessage.content}
                                </Typography>
                                <Button
                                    sx={(theme) => ({
                                        position: 'absolute',
                                        top: theme.spacing(1),
                                        right: theme.spacing(1),
                                        padding: theme.spacing(0.25),
                                        minWidth: 'unset',
                                        color: theme.palette.text.primary
                                    })}
                                    variant="text"
                                    onClick={() => setReplyToMessage(undefined)}
                                >
                                    <Close />
                                </Button>
                            </Paper>
                        </Box>
                    )}
                    <form onSubmit={sendMessage}>
                        <FormControl
                            fullWidth
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: ['wrap', 'nowrap'],
                                flexDirection: 'row',
                            }}
                        >
                            <TextField
                                id="message"
                                variant="outlined"
                                name="message"
                                value={message}
                                disabled={loading}
                                onChange={onInputChange}
                                autoComplete="off"
                                sx={{ flexGrow: 1, marginRight: 0.5 }}
                                size="small"
                                error={Boolean(messageError)}
                            />
                            <Button
                                disabled={Boolean(messageError)}
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Send
                            </Button>
                        </FormControl>
                    </form>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: message.length > 500 ? 'error.main' : 'text.secondary' }}>
                        {message.length}/500
                    </Typography>
                </Grid>
                {messageError && (
                    <Grid item xs={12} textAlign="center">
                        <FormHelperText sx={{ color: 'error.main', fontWeight: 700, textAlign:'center' }}>
                            {messageError}
                        </FormHelperText>
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
};

export { Chat };