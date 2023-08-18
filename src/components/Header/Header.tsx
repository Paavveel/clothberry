import { FC } from 'react';
import { Link } from 'react-router-dom';

import styles from './Header.module.css';

export const Header: FC = () => {
  return (
    <header>
      <nav className={styles.nav}>
        <ul className={styles.left}>
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
          <img src='logo.svg' alt='' />
        </Link>
        <div className={styles.right}>
          <div className={styles['search-wrapper']}>
            <input type='search' className={styles.search} placeholder='Поиск' />
          </div>
          <div className={styles['nav-btns']}>
            <Link to='*' className={styles.like}>
              <img src='fav.svg' alt='' />
            </Link>
            <Link to='*' className={styles.bag}>
              <img src='basket.svg' alt='' />
            </Link>
            <Link to='/login' className={styles.profile}>
              <img src='user.svg' alt='' />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
