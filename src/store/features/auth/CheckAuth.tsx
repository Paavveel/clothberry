import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppRoutes } from 'config/routes';

import { api } from '@api/client';
import { Loader } from '@components/Loader';
import { setAnonymousTokenInStorage } from '@helpers/TokenStorage';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import { checkLogin } from './authApi';
import { logout } from './authSlice';
import { checkCart } from './cartApi';

interface CheckAuthProps {
  children: JSX.Element;
}

export const CheckAuth: FC<PropsWithChildren<CheckAuthProps>> = ({ children }) => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestForAuth = async () => {
      try {
        const result = await dispatch(checkLogin()).unwrap();

        if (!result.active) {
          dispatch(logout());
          navigate(AppRoutes.ROOT, { replace: true });
        } else {
          await dispatch(checkCart());
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    requestForAuth();
    if (!isLoggedIn) {
      setAnonymousTokenInStorage(api.currentToken.tokenStore.token);
    }
  }, [dispatch, isLoggedIn, navigate]);

  if (loading) return <Loader pageLoader />;

  return children;
};
