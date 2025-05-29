import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '', // New field
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Player', // Default role
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { username, email, password, confirmPassword, role } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/user/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password, role }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register.');
      }

      const { token } = await response.json();
      localStorage.setItem('token', token);
      navigate('/dashboard'); // Redirect to dashboard after registration
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="DM">Dungeon Master</option>
            <option value="Player">Player</option>
            <option value="Citizen">Citizen</option>
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
