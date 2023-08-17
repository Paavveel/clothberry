import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { AppRoutes } from 'config/routes';

import { useAppSelector } from '@store/hooks';

import { selectAuth } from './authSlice';

export const RequireAuth: FC<PropsWithChildren> = ({ children }) => {
  const { isLoggedIn } = useAppSelector(selectAuth);

  if (!isLoggedIn) return <Navigate to={AppRoutes.SIGNIN} replace />;

  return children;
};
