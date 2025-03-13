import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {

  const handleGoogleLoginSuccess = (response) => {
    console.log('Google Login Success:', response);
    const token = response.credential;
    console.log('Google Token:', token);
  };

  const handleGoogleLoginFailure = (error) => {
    console.log('Google Login Error:', error);
  };

  

  return (
    <div className="login-container">
      <h2> login with Google</h2>
      <GoogleLogin
        clientId="546923409832-2cva7ifqqri4bmidqssco9esd206gqmf.apps.googleusercontent.com"  
        onSuccess={handleGoogleLoginSuccess}  
        onError={handleGoogleLoginFailure}    
      />
    </div>
  );
};

export default Login;