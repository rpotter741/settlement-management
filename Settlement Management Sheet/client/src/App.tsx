import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './context/QueryClient.js';
import './App.css';

import { AuthProvider } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';

import AppShell from './components/shared/AppShell/AppShell.js';
import pageRoutes from './components/shared/AppShell/routes.js';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppShell>
            <Routes>
              {pageRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </AppShell>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
