import { useContext, useState } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // To redirect after successful login
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null); // For error handling

  const handleLogin = async () => {
    try {
      console.log('o');
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/login`,
        credentials
      );
      localStorage.setItem('token', data.token);
      login(data.token); // Call AuthContext login function
      navigate('/dashboard'); // Redirect to the dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
      console.error('Login error:', err);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) =>
          setCredentials({ ...credentials, email: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
