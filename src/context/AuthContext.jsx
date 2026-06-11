import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api/index.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('vs_token'));
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    apiFetch('/api/auth/me')
      .then(({ user }) => setUser(user))
      .catch(() => {
        localStorage.removeItem('vs_token');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const saveSession = (tok, usr) => {
    localStorage.setItem('vs_token', tok);
    setToken(tok);
    setUser(usr);
  };

  const register = useCallback(async ({ name, email, password }) => {
    const { token, user } = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    saveSession(token, user);
    return user;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { token, user } = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    saveSession(token, user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('vs_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
