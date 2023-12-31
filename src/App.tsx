/* eslint-disable @typescript-eslint/no-unused-vars */
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AppRoutes } from 'config/routes';

import { ProductList } from '@components/ProductList/ProductList';
import { Layout } from '@layout/Layout';
import { AboutPage } from '@pages/AboutPage/AboutPage';
import { Basket } from '@pages/BasketPage/Basket';
import { HomePage } from '@pages/HomePage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { ProductPage } from '@pages/ProductPage';
import { ProfilePage } from '@pages/ProfilePage';
import { SignInPage } from '@pages/SignInPage';
import { SignUpPage } from '@pages/SignUpPage';
import { CheckAuth } from '@store/features/auth/CheckAuth';
import { RequireAuth } from '@store/features/auth/RequireAuth';

const { ROOT, SIGNUP, SIGNIN, PROFILE, BASKET, ABOUT } = AppRoutes;

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
        path: ABOUT,
        element: <AboutPage />,
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
        path: ':category',
        element: <ProductList />,
        errorElement: <NotFoundPage />,
      },
      {
        path: ':category/item/:id',
        element: <ProductPage />,
        errorElement: <NotFoundPage />,
      },
      {
        path: ':category/:subcategory',
        element: <ProductList />,
        errorElement: <NotFoundPage />,
      },
      {
        path: ':category/:subcategory/:id',
        element: <ProductPage />,
        errorElement: <NotFoundPage />,
      },

      {
        path: '/product-list-page',
        element: <ProductList />,
      },

      {
        path: BASKET,
        element: <Basket />,
      },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
