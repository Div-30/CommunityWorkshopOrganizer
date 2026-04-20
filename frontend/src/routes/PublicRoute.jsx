import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDefaultRouteForRole } from '../utils/constants';

export function PublicRoute({ children }) {
  const { user, loading, role } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return children;
}
