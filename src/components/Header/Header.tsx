import { FC } from 'react';
import { Link } from 'react-router-dom';

import basket from '@assets/img/basket.svg';
import fav from '@assets/img/fav.svg';
import user from '@assets/img/user.svg';

import styles from './Header.module.css';

export const Header: FC = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          <li>
            <a href='*'>Новинки</a>
          </li>
          <li>
            <a href='*'>Одежда</a>
          </li>
          <li>
            <a href='*'>Аксессуары</a>
          </li>
          <li>
            <a href='*'>Sale</a>
          </li>
        </ul>
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
          <Link to='/signin' className={styles.profile}>
            <img src={user} alt='signin' />
          </Link>
          <Link to='/signup' className={styles.profile}>
            <img src={user} alt='signup' />
          </Link>
        </div>
      </div>
    </header>
  );
};
