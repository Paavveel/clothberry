import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AppRoutes } from 'config/routes';

import { Layout } from '@layout/Layout';
import { SignUpPage } from '@pages/SignUpPage';

const { ROOT, SIGNUP } = AppRoutes;

const router = createBrowserRouter([
  {
    path: ROOT,
    element: <Layout />,
    children: [
      {
        element: <h1>Main</h1>,
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
