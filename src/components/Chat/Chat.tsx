import { v4 as uuidv4 } from 'uuid';
import { Box, Button, FormControl, FormHelperText, Grid, Paper, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, FunctionComponent, useEffect, useRef, useState } from "react";
import { useChatService } from "../../hooks";
import { ErrorMessage } from "../ErrorMessage";
import { Message, User } from '../../classes';
import { Loader } from "../Loader";

interface iProps {}

const resetTitle = () => {
    document.title = 'QA Chat Room';
};

let resetTitleTimeout: NodeJS.Timeout | undefined;

const Chat: FunctionComponent<iProps> = () => {
    const [ tempUser ] = useState<User>(() => {
        const newTempUser = new User(uuidv4(), "User McUser");
        return newTempUser;
    });

    const [replyToMessage, setReplyToMessage] = useState<Message>();
    const [message, setMessage] = useState<string>('');
    const [messageError, setMessageError] = useState<string>('');
    const [initialLoad, setInitialLoad] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [criticalError, setCriticalError] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([
        new Message(uuidv4(), "SYSTEM", new Date(), 'Welcome to the QA chat room! Please be respectful and have fun!')
    ]);

    const chatWindowRef = useRef<HTMLDivElement>(null);

    const handleNewMessage = (newMessage: Message) => {
        if (newMessage != null) {
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
        }
    };

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();
        let messageToSend = message;
        try {
            if (!tempUser) {
                throw new Error('No user account found! Please refresh the page to try again!');
            }
            setLoading(true);
            const newMessage = new Message(uuidv4(), tempUser.id, new Date(), messageToSend, false, replyToMessage);
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
        document.title = 'Welcome to the QA Chat!';
        resetTitleTimeout = setTimeout(resetTitle, 5000);
        setInitialLoad(false);
    };

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        getChatInitialState();
    }, [])

    if (criticalError) {
        return (
            <Grid container spacing={3} justifyContent="center" flexDirection="column">
                <Grid item>
                    <ErrorMessage message="There was a critical error. Please refresh the page to try entering the chata again." />
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
        <Box sx={{ border: '1px solid #222', borderRadius: 3, overflow: 'hidden' }}>
            <Grid
                container
                display="grid"
                spacing={2}
                sx={{ height: '65vh', overflow: 'auto' }}
                ref={chatWindowRef}
                mt={0}
                p={1}
            >
                {messages.map((message) => {
                    const {
                        id,
                        senderUserId,
                        content,
                        isAnswered,
                        isReplyTo
                    } = message;
                    if (senderUserId === "SYSTEM") {
                        return (
                            <Grid key={id} alignSelf="right" item xs={12}>
                                <Paper
                                    sx={{
                                        backgroundColor: 'warning.main',
                                        color: 'text.main',
                                        borderColor: 'warning.main',
                                        borderWidth: '2px',
                                        padding: 1,
                                        textAlign: 'center',
                                        fontWeight: 700,
                                        whiteSpace: 'pre-line', 
                                    }}
                                >
                                    {content}
                                </Paper>
                            </Grid>
                        );
                    }
                    if (senderUserId === "CHATBOT") {
                        return (
                            <Grid key={id} justifySelf="flex-start" item xs={8}>
                                <Paper
                                    sx={{
                                        color: 'primary.secondary',
                                        borderColor: 'primary.secondary',
                                        borderWidth: '2px',
                                        padding: 1,
                                        whiteSpace: 'pre-line', 
                                    }}
                                >
                                    {isReplyTo &&
                                        <>
                                            <Typography sx={{ fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} variant="caption">
                                                Replying To: {isReplyTo.content}
                                            </Typography>
                                            <br />
                                        </>
                                    }
                                    {content}
                                </Paper>
                            </Grid>
                        );
                    }
                    if (senderUserId === tempUser?.id) {
                        return (
                            <Grid key={id} justifySelf="flex-end" item xs={8}>
                                <Paper
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        color: '#FFF',
                                        borderColor: 'primary.main',
                                        borderWidth: '2px',
                                        padding: 1,
                                        whiteSpace: 'pre-line', 
                                    }}
                                >
                                    {isReplyTo &&
                                        <>
                                            <Typography sx={{ fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} variant="caption">
                                                Replying To: {isReplyTo.content}
                                            </Typography>
                                            <br />
                                        </>
                                    }
                                    {content}
                                </Paper>
                            </Grid>
                        );
                    }
                    return (
                        <Grid key={id} justifySelf="flex-start" item xs={8}>
                            <Paper
                                sx={{
                                    borderColor: 'primary.main',
                                    borderWidth: '2px',
                                    padding: 1,
                                    whiteSpace: 'pre-line', 
                                }}
                            >
                                {isReplyTo &&
                                    <>
                                        <Typography sx={{ fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} variant="caption">
                                            Replying To: {isReplyTo.content}
                                        </Typography>
                                        <br />
                                    </>
                                }
                                {content}
                            </Paper>
                            {!isAnswered && !isReplyTo && (
                                <Button sx={{ alignSelf: 'flex-end', textTransform: 'none' }} variant="text" onClick={() => setReplyToMessage(message)}>
                                    Answer this
                                </Button>
                            )}
                        </Grid>
                    );
                })}
            </Grid>
            <Grid container display="flex" p={1}>
                {replyToMessage && (
                    <Grid item xs={12}>
                        <Paper
                            sx={{
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
                                sx={{
                                    alignSelf: 'flex-end',
                                }}
                                variant="contained"
                                color="error"
                                onClick={() => setReplyToMessage(undefined)}
                            >
                                Cancel
                            </Button>
                        </Paper>
                    </Grid>
                )}
                <Grid item xs={12}>
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
                                sx={{ flexGrow: 1 }}
                                size="small"
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
        </Box>
    );
};

export { Chat };