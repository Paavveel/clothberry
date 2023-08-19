import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AppRoutes } from 'config/routes';

import { Layout } from '@layout/Layout';
import { HomePage } from '@pages/HomePage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { SignUpPage } from '@pages/SignUpPage';

const { ROOT, SIGNUP } = AppRoutes;

const router = createBrowserRouter([
  {
    path: ROOT,
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        path: SIGNUP,
        element: <SignUpPage />,
      },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
