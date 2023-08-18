import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AppRoutes } from 'config/routes';

import { Layout } from '@layout/Layout';
import { SignInPage } from '@pages/SignInPage';
import { SignUpPage } from '@pages/SignUpPage';
import { CheckAuth } from '@store/features/auth/CheckAuth';

const { ROOT, SIGNUP, SIGNIN } = AppRoutes;

const router = createBrowserRouter([
  {
    path: ROOT,
    element: (
      <CheckAuth>
        <Layout />
      </CheckAuth>
    ),
    children: [
      {
        element: <h1>Main</h1>,
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
