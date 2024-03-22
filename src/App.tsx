import React from 'react';
import './main.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './styles/themeOptions';
import { ChatPage } from './pages'
import { UserProvider } from './providers';

export const App = () => (
  <React.StrictMode>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ChatPage />
        </ThemeProvider>
      </UserProvider>
  </React.StrictMode>
);