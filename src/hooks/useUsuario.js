import { useCallback, useEffect, useState } from 'react';
import { loginUser, registerUser } from '../api/services/usersService.js';

export function useUsuario() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      setCurrentUser(raw ? JSON.parse(raw) : null);
    } catch {
      setCurrentUser(null);
    }
    const syncUser = () => {
      try {
        const rawUser = localStorage.getItem('currentUser');
        setCurrentUser(rawUser ? JSON.parse(rawUser) : null);
      } catch {
        setCurrentUser(null);
      }
    };
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    setCurrentUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  }, []);

  const register = useCallback(async (payload) => registerUser(payload), []);

  return { currentUser, login, logout, register };
}

export default useUsuario;
