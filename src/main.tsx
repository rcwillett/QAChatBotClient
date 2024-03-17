import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.css';
import { ChatPage } from './pages'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChatPage />
  </React.StrictMode>
);
