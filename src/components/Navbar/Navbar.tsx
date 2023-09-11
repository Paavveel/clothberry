import { FC } from 'react';
import { Link } from 'react-router-dom';

import { menuItems } from 'config/routes';

import { MenuItems } from './MenuItems';
import styles from './Navbar.module.css';

export const Navbar: FC = () => {
  return (
    <nav className={styles.nav}>
      <ul className={styles.menu}>
        <Link to='/' className={styles.menu__items}>
          Home
        </Link>
        {menuItems.map((menu, index) => {
          return <MenuItems items={menu} key={index} />;
        })}
        <Link to='/about' className={styles.menu__items}>
          About
        </Link>
      </ul>
    </nav>
  );
};
