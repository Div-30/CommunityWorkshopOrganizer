import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <SkeletonLoader className="h-24 rounded-[32px]" />
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <SkeletonLoader className="h-[520px] rounded-[32px]" />
            <div className="space-y-6">
              <SkeletonLoader className="h-40 rounded-[32px]" />
              <SkeletonLoader className="h-64 rounded-[32px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
