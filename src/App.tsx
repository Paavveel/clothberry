import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AppRoutes } from 'config/routes';

import { Layout } from '@layout/Layout';
import { HomePage } from '@pages/HomePage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { SignInPage } from '@pages/SignInPage';
import { SignUpPage } from '@pages/SignUpPage';
import { CheckAuth } from '@store/features/auth/CheckAuth';

const { ROOT, SIGNUP, SIGNIN } = AppRoutes;

const router = createBrowserRouter([
  {
    path: ROOT,
    errorElement: <NotFoundPage />,
    element: (
      <CheckAuth>
        <Layout />
      </CheckAuth>
    ),
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        path: SIGNUP,
        element: <SignUpPage />,
      },
      {
        path: SIGNIN,
        element: <SignInPage />,
      },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
