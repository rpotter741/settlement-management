import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const skipAuth = true;

  if (skipAuth) {
    // console.warn('Auth is skipped based on environment settings.');
    return children;
  }

  // return token ? children : <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
