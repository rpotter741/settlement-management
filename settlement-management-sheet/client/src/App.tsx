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
import { DndContext } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { dispatch } from './app/constants.js';
import fetchAllSubTypeData from './app/thunks/glossary/subtypes/fetchAllSubTypeData.js';
import GlobalDndContext from './context/DnD/GlobalDndContext.tsx';
import { invoke } from '@tauri-apps/api/core';
import { setUser } from './app/slice/userSlice.ts';
import { ulid as newId } from 'ulid';
import { Button } from '@mui/material';
import store from './app/store.ts';

const App = () => {
  const [userState, setUserState] = useState<any>(null);

  useEffect(() => {
    const initApp = async () => {
      const appData: {
        userId: string;
        username: string;
        email: string;
      } = await invoke('init_app');

      console.log(appData);

      dispatch(
        setUser({
          id: appData?.userId,
          username: 'robbiepottsdm',
          email: appData?.email,
          role: 'admin',
          tier: 'admin',
          features: [],
          token: null,
          isAuthenticated: !!appData?.userId,
          device: newId(),
          loading: false,
          error: null,
        })
      );
      setUserState(true);
    };
    initApp();
  }, []);

  useEffect(() => {
    if (!userState) return;
    dispatch(fetchAllSubTypeData());
  }, [dispatch, userState]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <GlobalDndContext>
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
          </GlobalDndContext>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
