// React Router Configuration
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '@pages/HomePage';
import DevCardsPage from '@pages/DevCardsPage';
import ChallengesPage from '@pages/ChallengesPage';
import AboutPage from '@pages/AboutPage';
import MemeLabPage from '@pages/MemeLabPage';
import PrivacyPage from '@pages/PrivacyPage';
import CookiePolicyPage from '@pages/CookiePolicyPage';
import NotFoundPage from '@pages/NotFoundPage';
import AuthCallbackPage from '@pages/AuthCallbackPage';
// Admin
import ProtectedRoute from '@features/admin/components/ProtectedRoute';
import AdminLayout from '@features/admin/components/AdminLayout';
import AdminLoginPage from '@pages/admin/AdminLoginPage';
import AdminDashboardPage from '@pages/admin/AdminDashboardPage';
import AdminDevCardsPage from '@pages/admin/AdminDevCardsPage';
import AdminCommunityMembersPage from '@pages/admin/AdminCommunityMembersPage';
import AdminChallengesPage from '@pages/admin/AdminChallengesPage';
import AdminSubmissionsPage from '@pages/admin/AdminSubmissionsPage';
import AdminMemesPage from '@pages/admin/AdminMemesPage';
import AdminNewsletterPage from '@pages/admin/AdminNewsletterPage';
import AdminSettingsPage from '@pages/admin/AdminSettingsPage';
import AdminRegisteredUsersPage from '@pages/admin/AdminRegisteredUsersPage';
import CommunityPage from '@pages/CommunityPage';

/**
 * Router Configuration for majdst.codes
 */
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomePage />,
      errorElement: <NotFoundPage />,
    },
    {
      path: '/dev-cards',
      element: <DevCardsPage />,
    },
    {
      path: '/challenges',
      element: <ChallengesPage />,
    },
    {
      path: '/about',
      element: <AboutPage />,
    },
    {
      path: '/meme-lab',
      element: <MemeLabPage />,
    },
    {
      path: '/auth/callback',
      element: <AuthCallbackPage />,
    },
    {
      path: '/community',
      element: <CommunityPage />,
    },
    {
      path: '/privacy',
      element: <PrivacyPage />,
    },
    {
      path: '/cookies',
      element: <CookiePolicyPage />,
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
    // Admin (public login)
    {
      path: '/admin/login',
      element: <AdminLoginPage />,
    },
    // Admin (protected)
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { path: '/admin', element: <AdminDashboardPage /> },
            { path: '/admin/dev-cards', element: <AdminDevCardsPage /> },
            { path: '/admin/community', element: <AdminCommunityMembersPage /> },
            { path: '/admin/challenges', element: <AdminChallengesPage /> },
            { path: '/admin/submissions', element: <AdminSubmissionsPage /> },
            { path: '/admin/memes', element: <AdminMemesPage /> },
            { path: '/admin/newsletter', element: <AdminNewsletterPage /> },
            { path: '/admin/settings', element: <AdminSettingsPage /> },
            { path: '/admin/registered-users', element: <AdminRegisteredUsersPage /> },
          ],
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
    future: {
      v7_normalizeFormMethod: true,
    },
  }
);

/**
 * Router Component
 */
export const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
