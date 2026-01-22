import React from 'react';
import CustomCreation from '@/components/pages/CustomCreation.js';
import LoginPage from '@/components/pages/Login.js';
import Register from '@/components/pages/Register.js';
import ProtectedRoute from '@/components/ProtectedRoute.js';
import {
  AppRegistration,
  BookOnline,
  Dashboard,
  DesignServices,
  Login,
  SwapHoriz,
} from '@mui/icons-material';

import { Navigate, useNavigate } from 'react-router-dom';
import MotionBox from '../Layout/Motion/MotionBox.js';
import EditGlossary from '@/features/Glossary/EditGlossary/EditGlossary.js';
import DefaultSidebar from './Sidebar/DefaultSidebar.js';
import TemplateManager from '@/features/Glossary/EditGlossary/Templates/TemplateManager.js';
import MainNIEParser from '@/features/SidePanel/NIE/MainNIEParser.js';
import { Box, Button } from '@mui/material';

const withAuth = ({ Component }: { Component: React.ComponentType }) => (
  // <ProtectedRoute>
  <Component />
  // </ProtectedRoute>
);

const LostPage = () => {
  const navigate = useNavigate();
  return (
    <Box>
      Whoops! <Button onClick={() => navigate('/login')}>Go to login</Button>
    </Box>
  );
};

const TestCase = () => {
  return (
    <MotionBox
      layoutId="test-case"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      Test Case
    </MotionBox>
  );
};

export const pageRoutes = [
  // {
  //   path: '/',
  //   element: <Navigate to="/dashboard" />,
  //   label: 'Home',
  //   icon: <Dashboard />,
  //   sidebar: DefaultSidebar,
  //   sidebarProps: {},
  //   sidebarNav: false,
  // },
  {
    path: '/dashboard',
    element: withAuth({ Component: TestCase }),
    label: 'Dashboard',
    icon: <Dashboard />,
    sidebar: DefaultSidebar,
    sidebarProps: {},

    sidebarNav: true,
  },
  {
    path: '/login',
    element: <LoginPage />,
    label: 'Login',
    icon: <Login />,
    sidebar: null,
    sidebarProps: {},

    sidebarNav: false,
  },
  {
    path: '/register',
    element: <Register />,
    label: 'Register',
    icon: <AppRegistration />,
    sidebar: null,
    sidebarProps: {},

    sidebarNav: false,
  },
  {
    path: '/customCreation',
    element: <CustomCreation />,
    label: 'Custom Creation',
    icon: <DesignServices />,
    sidebar: DefaultSidebar,
    sidebarProps: {},

    sidebarNav: true,
  },
  {
    path: '/editGlossary',
    element: withAuth({ Component: EditGlossary }),
    label: 'Edit Glossary',
    icon: <DesignServices />,
    sidebar: DefaultSidebar,
    sidebarProps: {},
    sidebarNav: true,
  },
  {
    path: '/glossaryTemplates',
    element: withAuth({ Component: TemplateManager }),
    label: 'Glossary Templates',
    icon: <DesignServices />,
    sidebar: DefaultSidebar,
    sidebarProps: {},
    sidebarNav: true,
  },
  {
    path: '/kits',
    element: withAuth({ Component: TestCase }),
    label: 'Kits',
    icon: <BookOnline />,
    sidebar: DefaultSidebar,
    sidebarProps: {},
  },
  {
    path: '/nie',
    element: withAuth({ Component: MainNIEParser }),
    label: 'NIE',
    icon: <SwapHoriz />,
    sidebar: DefaultSidebar,
    sidebarProps: {},
  },
  {
    path: '*',
    element: <LostPage />,
    label: 'Not Found',
    icon: null,
    sidebar: null,
    sidebarProps: {},
    sidebarNav: false,
  },
];

export default pageRoutes;
