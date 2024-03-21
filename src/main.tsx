import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './styles/themeOptions';
import { ChatPage } from './pages'
import { UserProvider } from './providers';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ChatPage />
        </ThemeProvider>
      </UserProvider>
  </React.StrictMode>
);
