import { v4 as uuidv4 } from 'uuid';
import { Box, Button, FormControl, FormHelperText, Grid, Paper, TextField, Typography } from "@mui/material";
import { ChangeEvent, FormEvent, FunctionComponent, useEffect, useRef, useState } from "react";
import { useChatService } from "../../hooks";
import { TypingIcon } from "../TypingIcon";
import { ErrorMessage } from "../ErrorMessage";
import { Message } from '../../classes';
import { IUser } from "../../types";
import { Loader } from "../Loader";

interface iProps {}

const resetTitle = () => {
    document.title = 'QA Chat Room';
};

let typingTimeout: NodeJS.Timeout | undefined;
let resetTitleTimeout: NodeJS.Timeout | undefined;

const Chat: FunctionComponent<iProps> = () => {
    const [ tempUser ] = useState<IUser>(() => {
        const localStorageUser = localStorage.getItem('tempUser');
        if (localStorageUser) {
            const localStorageUserJson = JSON.parse(localStorageUser);
            if (localStorageUserJson.id && localStorageUserJson.name) {
                return localStorageUserJson;
            }
        }
        const newTempUser = { id: uuidv4(), name: 'User McUser1' };
        localStorage.setItem('tempUser', JSON.stringify(newTempUser));
        return newTempUser;
    });

    const [replyToMessage, setReplyToMessage] = useState<Message>();
    const [message, setMessage] = useState<string>('');
    const [messageWarning, setMessageWarning] = useState<string>('');
    const [messageError, setMessageError] = useState<string>('');
    const [otherUserTyping, setOtherUserTyping] = useState<boolean>(false);
    const otherUserTypingRef = useRef<boolean>(otherUserTyping);
    const [initialLoad, setInitialLoad] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [criticalError, setCriticalError] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "initial_message",
            senderUserId: "SYSTEM",
            sent: new Date(),
            content: 'Welcome to the QA chat room! Please be respectful and have fun!',
        },
    ]);

    const messagesRef = useRef<Message[]>(messages);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const isTyping = useRef<boolean>(false);

    const handleUserTypingUpdate = async (otherUserTyping: boolean) => {
        if (otherUserTyping !== otherUserTypingRef.current) {
            otherUserTypingRef.current = otherUserTyping;
            setOtherUserTyping(otherUserTyping);
        }
    };

    const handleNewMessage = async (newMessage: Message) => {
        if (newMessage != null) {
            const updatedMessages = [...messagesRef.current, newMessage]
            messagesRef.current = updatedMessages;
            setMessages(updatedMessages);
            document.title = 'New Message!';
            clearTimeout(resetTitleTimeout);
            resetTitleTimeout = setTimeout(resetTitle, 5000);
        }
    };

    const { sendMessage: sendMessageToApi, setUserTyping } = useChatService({
        messageHandler: handleNewMessage,
        typingHandler: handleUserTypingUpdate,
    });

    const onInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        let newMessage = e.target.value;
        setMessage(newMessage);
        if (newMessage.length > 500) {
            setMessageError('Your message is greater than 500 characters. Please reduce it to 500 characters!');
            setMessageWarning('');
            return;
        }
        if (!isTyping.current) {
            isTyping.current = true;
            setUserTyping({ tempUserId: tempUser?.id || "", isTyping: true });
        }
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            isTyping.current = false;
            setUserTyping({ tempUserId: tempUser?.id || "", isTyping: false });
        }, 3000);
    };

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();
        let messageToSend = message;
        try {
            if (!tempUser) {
                throw new Error('No user account found! Please refresh the page to try again!');
            }
            setLoading(true);
            isTyping.current = false;
            clearTimeout(typingTimeout);
            const newMessage = new Message(uuidv4(), tempUser.id, new Date(), messageToSend, replyToMessage);
            await sendMessageToApi(newMessage);
            const messageWithInfo: Message = {
                id: uuidv4(),
                senderUserId: tempUser.id,
                sent: new Date(),
                content: messageToSend,
            };
            setLoading(false);
            const updatedMessages = [...messagesRef.current, messageWithInfo]
            messagesRef.current = updatedMessages;
            setMessages(updatedMessages);
            setMessage('');
            setMessageError('');
            setMessageWarning('');
            window.requestAnimationFrame(() => {
                const messageInput = document.getElementById('message');
                messageInput?.focus();
            });
        } catch (error: any) {
            setLoading(false);
            setMessageWarning('');
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
    }, [messages, otherUserTyping]);

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
                            <Button sx={{ alignSelf: 'flex-end' }} variant="text" onClick={() => setReplyToMessage(message)}>
                                Reply to this
                            </Button>
                        </Grid>
                    );
                })}
                {otherUserTyping && (
                    <Grid justifySelf="flex-start" item xs={8}>
                        <Paper
                            sx={{
                                borderColor: 'primary.main',
                                borderWidth: '2px',
                                padding: 1,
                            }}
                        >
                            <TypingIcon />
                        </Paper>
                    </Grid>
                )}
            </Grid>
            <Grid container display="flex" p={1}>
                {replyToMessage && (
                    <Grid item xs={12}>
                        <Paper
                            sx={{
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
                                    color: 'text.error',
                                }}
                                variant="text"
                                onClick={() => setReplyToMessage(undefined)}
                            >
                                Cancel reply
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
                                InputProps={{
                                    disableUnderline: true,
                                }}
                                size="small"
                            />
                            <Button
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
                {messageWarning && (
                    <Grid item xs={12}>
                            <FormHelperText sx={{ color: 'warning.main', textAlign:'center' }}>
                                {messageWarning}
                            </FormHelperText>
                    </Grid>
                )}
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