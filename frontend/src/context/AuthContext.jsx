import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/services';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('eventms_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  // Revalidate token on mount (optional, best-effort)
  useEffect(() => {
    const token = localStorage.getItem('eventms_token');
    if (token && !user) {
      authAPI
        .me()
        .then((u) => {
          setUser(u);
          localStorage.setItem('eventms_user', JSON.stringify(u));
        })
        .catch(() => {});
    }
  }, []); // eslint-disable-line

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const data = await authAPI.login(credentials);
      localStorage.setItem('eventms_token', data.token);
      localStorage.setItem('eventms_user', JSON.stringify(data));
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (body) => {
    setLoading(true);
    try {
      const data = await authAPI.signup(body);
      localStorage.setItem('eventms_token', data.token);
      localStorage.setItem('eventms_user', JSON.stringify(data));
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('eventms_token');
    localStorage.removeItem('eventms_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
