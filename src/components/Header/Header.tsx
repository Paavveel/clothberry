import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

import basket from '@assets/img/basket.svg';
import fav from '@assets/img/fav.svg';
import signin from '@assets/img/signin.svg';
import user from '@assets/img/user.svg';

import styles from './Header.module.css';

export const Header: FC = () => {
  const [active, setActive] = useState(false);

  const handleActiveClass = () => {
    setActive((active) => !active);
  };
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={active ? styles['menu-active'] : styles.menu}>
          <li>
            <a className={styles['menu-link']} href='*'>
              Novelties
            </a>
          </li>
          <li>
            <a className={styles['menu-link']} href='*'>
              Cloth
            </a>
          </li>
          <li>
            <a className={styles['menu-link']} href='*'>
              Accessories
            </a>
          </li>
          <li>
            <a className={styles['menu-link']} href='*'>
              Sale
            </a>
          </li>
        </ul>
        <button className={styles.burger} onClick={handleActiveClass}>
          <span className={active ? styles['burger-line-active'] : styles['burger-line']}> </span>
        </button>
      </nav>
      <div className={styles['logo-wrapper']}>
        <Link to='/' className={styles.logo}>
          clothberry
        </Link>
      </div>
      <div className={styles.right}>
        <div className={styles['search-wrapper']}>
          <input type='search' className={styles.search} placeholder='Поиск' />
        </div>
        <div className={styles['nav-btns']}>
          <Link to='*' className={styles.like}>
            <img src={fav} alt='favorite' />
          </Link>
          <Link to='*' className={styles.bag}>
            <img src={basket} alt='basket' />
          </Link>
          <Link to='/signin' className={styles.signin}>
            <img src={signin} alt='signin' />
          </Link>
          <Link to='/signup' className={styles.signup}>
            <img src={user} alt='signup' />
          </Link>
        </div>
      </div>
    </header>
  );
};
