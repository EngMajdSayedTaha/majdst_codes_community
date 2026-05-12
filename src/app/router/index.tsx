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
