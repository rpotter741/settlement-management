import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './context/QueryClient.js';
import './App.css';

import { AuthProvider } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';

import AppShell from './components/shared/AppShell/AppShell.js';
import pageRoutes from './components/shared/AppShell/routes.js';
import { DragProvider } from './context/DnD/GlobalDrag.js';
import { useEffect } from 'react';
import { dispatch } from './app/constants.js';
import fetchAllSubTypeData from './app/thunks/glossary/subtypes/fetchAllSubTypeData.js';

const App = () => {
  useEffect(() => {
    dispatch(fetchAllSubTypeData());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <DragProvider>
            <Router>
              <AppShell>
                <Routes>
                  {pageRoutes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                </Routes>
              </AppShell>
            </Router>
          </DragProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
