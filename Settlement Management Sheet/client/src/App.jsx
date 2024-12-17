import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import './tailwind.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';

import LoginPage from './components/pages/Login';
import Register from './components/pages/Register';
import Dashboard from './components/Dashboard';
import CustomCreation from './components/pages/CustomCreation';
/*!!localStorage.getItem('token') */
const App = () => {
  const isAuthenticated = true;

  return (
    <React.StrictMode>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* Public Route */}
              <Route
                path="/"
                element={
                  <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/customCreation" element={<CustomCreation />} />

              {/* Protected Route */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<p>404: Page not found</p>} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </React.StrictMode>
  );
};

export default App;
