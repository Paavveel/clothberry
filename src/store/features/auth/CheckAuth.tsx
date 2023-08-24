import { FC, PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppRoutes } from 'config/routes';

import { useAppDispatch, useAppSelector } from '@store/hooks';

import { checkLogin } from './authApi';
import { logout, selectAuth } from './authSlice';

interface CheckAuthProps {
  children: JSX.Element;
}

export const CheckAuth: FC<PropsWithChildren<CheckAuthProps>> = ({ children }) => {
  const { isLoggedIn } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const requestForAuth = async () => {
      try {
        const result = await dispatch(checkLogin()).unwrap();

        if (!result.active) {
          dispatch(logout());
          navigate(AppRoutes.ROOT, { replace: true });
        }
      } catch (error) {}
    };

    if (isLoggedIn) {
      requestForAuth();
    }
  }, [dispatch, isLoggedIn, navigate]);

  return children;
};
