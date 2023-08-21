import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames';
import { AppRoutes } from 'config/routes';

import { ReactComponent as Basket } from '@assets/img/basket.svg';
import { ReactComponent as Logout } from '@assets/img/logout.svg';
import { ReactComponent as User } from '@assets/img/user.svg';
import { logout, selectAuth } from '@store/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import styles from './Header.module.css';

export const Header: FC = () => {
  const [active, setActive] = useState(false);
  const { isLoggedIn } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  const handleActiveClass = () => {
    setActive((active) => !active);
  };
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul
          className={classNames({
            [styles['menu-active']]: active,
            [styles.menu]: !active,
          })}
        >
          <li>
            <a className={styles['menu-link']} href='*'>
              Sweatshirts
            </a>
          </li>
          <li>
            <a className={styles['menu-link']} href='*'>
              Hoodie
            </a>
          </li>
          <li>
            <a className={styles['menu-link']} href='*'>
              T-shirts
            </a>
          </li>
          <li>
            <a className={styles['menu-link']} href='*'>
              Jeans
            </a>
          </li>
        </ul>
        <button
          className={classNames(styles.burger, {
            [styles.open]: active,
            [styles.menu]: !active,
          })}
          onClick={handleActiveClass}
        >
          <span> </span>
          <span> </span>
          <span> </span>
        </button>
      </nav>
      <div className={styles['logo-wrapper']}>
        <Link to='/' className={styles.logo}>
          clothberry
        </Link>
      </div>
      <div className={styles.right}>
        <div className={styles['search-wrapper']}>
          <input type='search' className={styles.search} placeholder='search' />
        </div>
        <div className={styles['nav-btns']}>
          <Link to={AppRoutes.CART}>
            <Basket className={styles['header-icon']} />
          </Link>
          <Link to={AppRoutes.PROFILE}>
            <User className={styles['header-icon']} />
          </Link>
          {isLoggedIn && (
            <button type='button' className={styles.logout} onClick={handleLogout}>
              <Logout className={styles['header-icon']} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
