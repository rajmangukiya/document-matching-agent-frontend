import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/main-layout';
import AccountPage from '../pages/account';
import AdminCompanyPage from '../pages/admin/company';
import AdminDashboardPage from '../pages/admin/dashboard';
import LoginPage from '../pages/auth/login';
import DocumentDetailPage from '../pages/documents/detail';
import JourneyDetailPage from '../pages/journeys/detail';
import JourneysPage from '../pages/journeys/list';
import NotFoundPage from '../pages/not-found';
import SkeletonDetailPage from '../pages/skeletons/detail';
import SkeletonsPage from '../pages/skeletons/list';
import UsersPage from '../pages/users';
import { Permission } from '../types/permission';
import HomeRedirect from './home-redirect';
import { PATHS } from './paths';
import ProtectedRoute from './protected-route';

export const router = createBrowserRouter([
  // Login redirects signed-in users home itself
  { path: PATHS.LOGIN, element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: PATHS.HOME, element: <HomeRedirect /> },
          { path: PATHS.ACCOUNT, element: <AccountPage /> },
          {
            // Platform super admin
            element: <ProtectedRoute area="admin" />,
            children: [
              { path: PATHS.ADMIN, element: <AdminDashboardPage /> },
              { path: PATHS.ADMIN_COMPANY, element: <AdminCompanyPage /> },
            ],
          },
          {
            // Company workspace
            element: <ProtectedRoute area="company" />,
            children: [
              { path: PATHS.JOURNEYS, element: <JourneysPage /> },
              { path: PATHS.JOURNEY, element: <JourneyDetailPage /> },
              { path: PATHS.DOCUMENT, element: <DocumentDetailPage /> },
              { path: PATHS.SKELETONS, element: <SkeletonsPage /> },
              { path: PATHS.SKELETON, element: <SkeletonDetailPage /> },
              {
                element: <ProtectedRoute area="company" permission={Permission.MANAGE_USERS} />,
                children: [{ path: PATHS.USERS, element: <UsersPage /> }],
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
