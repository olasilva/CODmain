// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

// Read + clean the Google Client ID
const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();

// Debug log — check the browser console after restart
console.log('🔵 [main.jsx] Google Client ID:', googleClientId || '(EMPTY — check .env)');
console.log('🔵 [main.jsx] Client ID length:', googleClientId.length);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);