import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import { ReactComponent as Basket } from '@assets/img/basket.svg';
import { ReactComponent as User } from '@assets/img/user.svg';

import styles from './Header.module.css';

export const Header: FC = () => {
  const [active, setActive] = useState(false);

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
          <Link to='*'>
            <Basket className={styles['header-icon']} />
          </Link>
          <Link to='/signup'>
            <User className={styles['header-icon']} />
          </Link>
        </div>
      </div>
    </header>
  );
};
