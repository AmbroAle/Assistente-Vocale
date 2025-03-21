import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router';
const Login = () => {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      console.log('Authorization Code:', response.code);

      try {
        const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
        const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
        const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
        const params = new URLSearchParams();
        params.append('code', response.code);
        params.append('client_id', CLIENT_ID);
        params.append('client_secret', CLIENT_SECRET);
        params.append('redirect_uri', REDIRECT_URI);
        params.append('grant_type', 'authorization_code');
        console.log('Authorization Code per vedere se non è nullo:', response.code);
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        if (!tokenResponse.ok) {
          const errorDetails = await tokenResponse.json();
          console.error('Errore nel ricevere il token:', errorDetails);
        } 
        const tokenData = await tokenResponse.json();
        console.log('Token:', tokenData);
        const res = await fetch('http://localhost:8000/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: tokenData.access_token }),
        });
        if (!res.ok) {
          console.error("errore scambio token:",res);
        }
        navigate("/dashboard");
      } catch (error) {
        console.log('Error exchanging code:', error.json());
      }
    },
    onError: (error) => console.error('Login Failed:', error),
    scope: 'openid email profile https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/drive.readonly',
  });
  
  return (
    <div className="login-container">
      <h2>Login with Google</h2>
      <button className='loginButton' onClick={() => login()}>Sign in with Google</button>
    </div>
  );
};

export default Login;