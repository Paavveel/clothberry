import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppRoutes } from 'config/routes';

import { Loader } from '@components/Loader';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import { checkToken } from './authApi';
import { logout } from './authSlice';
import { checkCart } from './cartApi';
import { getCustomer } from './profileApi';

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
        await dispatch(getCustomer());

        const token = await dispatch(checkToken()).unwrap();

        if (!token.active) {
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
  }, [dispatch, navigate, isLoggedIn]);

  if (loading) return <Loader pageLoader />;

  return children;
};
