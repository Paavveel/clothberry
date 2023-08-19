import { FC } from 'react';
import { Link } from 'react-router-dom';

import styles from './Header.module.css';

export const Header: FC = () => {
  return (
    <header>
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          <li>
            <a href='/'>Новинки</a>
          </li>
          <li>
            <a href='/'>Одежда</a>
          </li>
          <li>
            <a href='/'>Аксессуары</a>
          </li>
          <li>
            <a href='/'>Sale</a>
          </li>
        </ul>
        <Link to='/'>
          <img src='logo.svg' alt='logo' />
        </Link>
        <div className={styles.right}>
          <div className={styles['search-wrapper']}>
            <input type='search' className={styles.search} placeholder='Поиск' />
          </div>
          <div className={styles['nav-btns']}>
            <Link to='*' className={styles.like}>
              <img src='fav.svg' alt='favorite' />
            </Link>
            <Link to='*' className={styles.bag}>
              <img src='basket.svg' alt='basket' />
            </Link>
            <Link to='/signin' className={styles.profile}>
              <img src='user.svg' alt='signin' />
            </Link>
            <Link to='/signup' className={styles.profile}>
              <img src='user.svg' alt='signup' />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
