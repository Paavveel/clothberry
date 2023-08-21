import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AppRoutes } from 'config/routes';

import { Layout } from '@layout/Layout';
import { HomePage } from '@pages/HomePage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { SignInPage } from '@pages/SignInPage';
import { SignUpPage } from '@pages/SignUpPage';
import { CheckAuth } from '@store/features/auth/CheckAuth';
import { RequireAuth } from '@store/features/auth/RequireAuth';

const { ROOT, SIGNUP, SIGNIN, PROFILE, CART } = AppRoutes;

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
      {
        path: PROFILE,
        element: (
          <RequireAuth>
            <h1>Profile</h1>
          </RequireAuth>
        ),
      },
      {
        path: CART,
        element: <h1>CART</h1>,
      },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
