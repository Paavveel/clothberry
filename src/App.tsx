import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AppRoutes } from 'config/routes';

import { ProductList } from '@components/ProductList/ProductList';
import { Layout } from '@layout/Layout';
import { HomePage } from '@pages/HomePage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { ProductPage } from '@pages/ProductPage';
import { ProfilePage } from '@pages/ProfilePage';
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
            <ProfilePage />
          </RequireAuth>
        ),
      },
      {
        path: '/:category/:name?',
        element: <ProductList />,
        errorElement: <NotFoundPage />,
      },
      {
        path: '/:category/:name?/:id',
        element: <ProductPage />,
      },
      {
        path: '/product-list-page',
        element: <ProductList />,
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
