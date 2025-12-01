import React, { useState } from 'react';
import TabbedContainer from '../../components/shared/TabbedContainer/TabbedContainer.js';
import useProtectedRoute from '@/hooks/auth/isAuthenticated.js';

const CustomCreation = () => {
  const { authenticated, goToLogin } = useProtectedRoute();

  if (!authenticated) {
    return goToLogin();
  }

  return (
    <>
      <TabbedContainer />
    </>
  );
};

export default CustomCreation;
