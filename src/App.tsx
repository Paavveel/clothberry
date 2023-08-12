import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Layout } from '@layout/Layout';
import { RegisterPage } from '@pages/Register/RegisterPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        element: <h1>Main</h1>,
        index: true,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
