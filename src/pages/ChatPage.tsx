import { FunctionComponent, useContext } from 'react';
import { Chat } from '../components';
import { Box, Container, Grid, Typography } from '@mui/material';
import { UserContext } from '../contexts';
import { SignUp } from '../components/SignUp/SignUp';

const ChatPage: FunctionComponent = () => {
    const { user } = useContext(UserContext);

    if (user) {
        return (
            <Box component="main" sx={{ padding: '30px 0', minHeight: '60vh' }}>
                <Container>
                    <Grid container justifyContent="center">
                        <Grid item xs={12} md={8} lg={6}>
                            <Typography variant="h4" component="h1" align="left" gutterBottom>
                                Forum Chat
                            </Typography>
                            <Chat />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        )
    }

    return (
        <Box component="main" sx={{ padding: '30px 0'}}>
            <Container>
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={8} lg={6}>
                        <Typography textAlign="center" variant="h4" component="h1" align="left" gutterBottom>
                            Welcome to Forum Chat
                        </Typography>
                        <Typography textAlign="center" variant="body1" component="p" align="left" pb={3}>
                            Forum chat is the best place to anonymously ask questions and get answers! Any previously answered questions will be answered by our unique forum chat bot. Enter a username to join the chat!
                        </Typography>
                        <SignUp />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );

};

export { ChatPage };