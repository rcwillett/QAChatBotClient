import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './styles/themeOptions';
import { ChatPage } from './pages'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatPage />
    </ThemeProvider>
  </React.StrictMode>
);
