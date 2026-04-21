import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authAPI } from '../services/api';

// Decode a JWT token client-side (no library needed — JWT is just base64 JSON)
// JwtSecurityTokenHandler uses SHORT claim names by default:
//   ClaimTypes.NameIdentifier → "nameid"
//   ClaimTypes.Name           → "unique_name"
//   ClaimTypes.Email          → "email"
//   ClaimTypes.Role           → "role"
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    const role = decoded['role']
      || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    const fullName = decoded['unique_name']
      || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
      || decoded['name']
      || decoded['email']
      || '';
    return {
      userId: decoded['nameid'] || decoded['sub']
        || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      email: decoded['email']
        || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      role,
      userRole: role,
      fullName,
    };
  } catch {
    return null;
  }
};

export const AuthContext = createContext(null);

const normalizeRole = (role) => String(role || '').toLowerCase();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      // PRODUCTION CODE
      const token = localStorage.getItem('token');

      if (!token) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      // Sanitize: a previous failed attempt may have stored the string "null" or "undefined"
      if (!token || token === 'null' || token === 'undefined') {
        localStorage.removeItem('token');
        if (isMounted) setLoading(false);
        return;
      }

      try {
        // Decode token client-side — no extra API call needed
        const decoded = decodeToken(token);
        if (!decoded) throw new Error('Malformed token');
        if (isMounted) {
          setUser(decoded);
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
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    const tokenStr = response.token || response.Token;
    
    if (!tokenStr || tokenStr === 'undefined') {
       console.error("CRITICAL: Login response did not contain a valid token!", response);
       throw new Error("Server failed to return an authorization token.");
    }

    localStorage.setItem('token', tokenStr);
    
    // Decode the token client-side — no extra API call to /profile needed
    const currentUser = decodeToken(tokenStr);
    if (!currentUser) throw new Error('Received an invalid token from the server.');
    
    setUser(currentUser);
    return currentUser;
  };

  const register = async ({ email, password, fullName, role }) => {
    // 1. Create the user (throws on duplicate email or validation error)
    await authAPI.register(email, password, fullName, role);
    
    // 2. Try auto-login — if this fails (e.g. backend config issue),
    //    we still know the account was created, so return a partial result.
    try {
      const loggedInUser = await login(email, password);
      return { created: true, loggedIn: true, user: loggedInUser };
    } catch (autoLoginErr) {
      console.warn('Account created but auto-login failed:', autoLoginErr.message);
      return { created: true, loggedIn: false, user: null };
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
