import { Navigate } from 'react-router-dom';

const useProtectedRoute = () => {
  const authenticated = localStorage.getItem('token');
  //@ts-ignore
  const skipAuth = import.meta.env.VITE_SKIP_AUTH === 'true';

  // if (skipAuth) {
  //   console.log('Auth is skipped based on environment settings.');
  //   return true;
  // }

  const goToLogin = () => <Navigate to="/login" />;

  return { authenticated: true, goToLogin };
};

export default useProtectedRoute;
