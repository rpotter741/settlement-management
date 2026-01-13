import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const skipAuth = import.meta.env.VITE_SKIP_AUTH === 'true';

  if (skipAuth) {
    // console.warn('Auth is skipped based on environment settings.');
    return children;
  }

  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
