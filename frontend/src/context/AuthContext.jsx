import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

const normalizeRole = (role) => String(role || '').toLowerCase();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      // DEVELOPMENT MODE: Use mock user
      if (isMounted) {
        setUser({
          userId: 1,
          fullName: 'Demo User',
          email: 'demo@example.com',
          role: 'Organizer' // Change to 'Attendee' to test attendee view
        });
        setLoading(false);
      }
      return;

      /* PRODUCTION CODE - Uncomment to enable real authentication
      const token = localStorage.getItem('token');

      if (!token) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const currentUser = await authAPI.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        localStorage.removeItem('token');
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
      */
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password, role = 'Attendee') => {
    // DEVELOPMENT MODE: Allow login or use mock user
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return response.user;
    } catch (error) {
      // If login fails, you can still use mock user with selected role
      console.log('Login failed, using mock user with role:', role);
      const mockUser = {
        userId: 1,
        fullName: email ? email.split('@')[0] : 'Demo User',
        email: email || 'demo@example.com',
        role: role
      };
      setUser(mockUser);
      return mockUser;
    }
  };

  const register = async ({ email, password, fullName, role }) => {
    // DEVELOPMENT MODE: Allow registration or use mock user
    try {
      const response = await authAPI.register(email, password, fullName, role);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return response.user;
    } catch (error) {
      // If registration fails, you can still use mock user
      console.log('Registration failed, using mock user');
      const mockUser = {
        userId: 1,
        fullName: fullName,
        email: email,
        role: role
      };
      setUser(mockUser);
      return mockUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      role: normalizeRole(user?.role),
      login,
      register,
      logout,
      setUser,
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
