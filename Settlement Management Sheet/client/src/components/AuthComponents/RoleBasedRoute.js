import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const RoleBasedRoute = ({ roles, children }) => {
  const { user } = useContext(AuthContext);
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
};

export default RoleBasedRoute;
