import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

const LoginPage = () => {
  // const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // To redirect after successful login
  // const [credentials, setCredentials] = useState({ email: '', password: '' });
  // const [error, setError] = useState(null); // For error handling

  // const handleLogin = async () => {
  //   try {
  //     const { data } = await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/user/login`,
  //       credentials
  //     );
  //     localStorage.setItem('token', data.token);
  //     login(data.token); // Call AuthContext login function
  //     navigate('/dashboard'); // Redirect to the dashboard
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Something went wrong.');
  //     console.error('Login error:', err);
  //   }
  // };

  return (
    <Box sx={{ width: '100vw', height: '100vh', p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ width: '100%' }}>
        Login
      </Typography>
      <Button
        onClick={() => {
          navigate('/customCreation');
        }}
      >
        Skip Login
      </Button>
    </Box>
  );
};

export default LoginPage;
