import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../../common-components/loader';
import { useAuth } from '../../context/auth';
import type { Permission } from '../../types/permission';
import { PATHS } from '../paths';

interface ProtectedRouteProps {
  // 'admin' = platform super admin only, 'company' = company users only
  area?: 'admin' | 'company';
  permission?: Permission;
}

const ProtectedRoute = ({ area, permission }: ProtectedRouteProps) => {
  const { user, isLoading, isSuperAdmin, can } = useAuth();
  const location = useLocation();

  if (isLoading) return <Loader size="lg" fullScreen />;

  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace state={{ from: location }} />;
  }

  const wrongArea = (area === 'admin' && !isSuperAdmin) || (area === 'company' && isSuperAdmin);
  if (wrongArea || (permission && !can(permission))) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
