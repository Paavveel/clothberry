import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { AppRoutes } from 'config/routes';

import { useAppSelector } from '@store/hooks';

import { selectAuth } from './authSlice';

interface RequireAuthProps {
  children: JSX.Element;
}

export const RequireAuth: FC<PropsWithChildren<RequireAuthProps>> = ({ children }) => {
  const { isLoggedIn } = useAppSelector(selectAuth);

  if (!isLoggedIn) return <Navigate to={AppRoutes.SIGNIN} replace />;

  return children;
};
