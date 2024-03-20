import React, { FunctionComponent } from 'react';
import { Chat } from '../components';
import { Box, Container, Grid, Typography } from '@mui/material';

const ChatPage: FunctionComponent = () => {
    return (
        <Box component="main" sx={{ padding: '80px 0', minHeight: '60vh' }}>
            <Container>
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={8} lg={6}>
                        <Typography variant="h4" component="h1" align="left" gutterBottom>
                            Forum
                        </Typography>
                        <Chat />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
};

export { ChatPage };