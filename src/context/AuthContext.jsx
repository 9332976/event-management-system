import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken, getToken } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cc_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
    return null;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    const savedRole = localStorage.getItem('cc_role');
    return savedRole || 'guest';
  });

  const [loading, setLoading] = useState(!!getToken());

  const persistUser = (user) => {
    setCurrentUser(user);
    const role = user?.role || 'guest';
    setCurrentRole(role);
    localStorage.setItem('cc_user', JSON.stringify(user));
    localStorage.setItem('cc_role', role);
  };

  // Restore session from stored JWT on app boot
  useEffect(() => {
    let mounted = true;
    const restoreSession = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.get('/auth/me');
        if (mounted) persistUser(data.user);
      } catch (error) {
        console.error('Session restore failed:', error.message);
        if (mounted) {
          setCurrentUser(null);
          setCurrentRole('guest');
          localStorage.removeItem('cc_user');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    restoreSession();
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    setToken(data.token);
    persistUser(data.user);
    return data.user;
  };

  // New accounts start as 'pending' and receive no token until an admin approves them.
  const register = async (formData) => {
    const data = await api.post('/auth/register', formData);
    return { user: data.user, message: data.message };
  };

  const updateProfile = async (updatedFields) => {
    const data = await api.patch('/users/me', updatedFields, { auth: true });
    persistUser(data.user);
    return data.user;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole('guest');
    setToken(null);
    localStorage.removeItem('cc_user');
    localStorage.setItem('cc_role', 'guest');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        loading,
        isAuthenticated: !!currentUser && currentRole !== 'guest',
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};