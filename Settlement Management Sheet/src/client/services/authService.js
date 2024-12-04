import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const register = (username, password, role) =>
  axios.post(`${API_URL}/register`, { username, password, role });

export const login = (username, password) =>
  axios.post(`${API_URL}/login`, { username, password });

export const getProtectedData = (token) =>
  axios.get(`${API_URL}/protected`, {
    headers: { Authorization: `Bearer ${token}` },
  });

//   const login = async () => {
//   try {
//     const response = await authService.login(username, password);
//     localStorage.setItem('token', response.data.token);
//   } catch (err) {
//     console.error('Login failed:', err);
//   }
// };

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
