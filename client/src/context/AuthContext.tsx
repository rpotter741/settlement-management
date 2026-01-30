import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: any;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children } : {children: React.ReactNode}) => {
  const [user, setUser] = useState<any>(null);

  const login = (token : string) => {
    const decoded = jwtDecode(token);
    setUser({ ...decoded, token });
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) login(token);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
