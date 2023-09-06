import { FC } from 'react';
import { Link } from 'react-router-dom';

import { AppRoutes } from 'config/routes';

import { ReactComponent as Basket } from '@assets/img/basket.svg';
import { ReactComponent as Logout } from '@assets/img/logout.svg';
import { ReactComponent as User } from '@assets/img/user.svg';
import { MobileMenu } from '@components/MobileMenu/MobileMenu';
import { Navbar } from '@components/Navbar/Navbar';
import { logout } from '@store/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import styles from './Header.module.css';

export const Header: FC = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <header className={styles.header}>
      <Navbar />
      <MobileMenu />
      <div className={styles['logo-wrapper']}>
        <Link to='/' className={styles.logo} area-label='logo'>
          clothberry
        </Link>
      </div>

      <div className={styles['nav-btns']}>
        <Link to={AppRoutes.BASKET} area-label='cart'>
          <Basket className={styles['header-icon']} />
        </Link>
        <Link to={AppRoutes.PROFILE} area-label='profile'>
          <User className={styles['header-icon']} />
        </Link>
        {isLoggedIn && (
          <button type='button' aria-label='logout' className={styles.logout} onClick={handleLogout}>
            <Logout className={styles['header-icon']} />
          </button>
        )}
      </div>
    </header>
  );
};
