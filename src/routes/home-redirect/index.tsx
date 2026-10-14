import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { PATHS } from '../paths';

// Sends each user to their own landing page
const HomeRedirect = () => {
  const { isSuperAdmin } = useAuth();
  return <Navigate to={isSuperAdmin ? PATHS.ADMIN : PATHS.JOURNEYS} replace />;
};

export default HomeRedirect;
