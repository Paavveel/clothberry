import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { AppRoutes } from 'config/routes';

import { useAppSelector } from '@store/hooks';

interface RequireAuthProps {
  children: JSX.Element;
}

export const RequireAuth: FC<PropsWithChildren<RequireAuthProps>> = ({ children }) => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) return <Navigate to={AppRoutes.SIGNIN} replace />;

  return children;
};
