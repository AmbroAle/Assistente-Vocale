import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = "546923409832-2cva7ifqqri4bmidqssco9esd206gqmf.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root')); 

root.render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);