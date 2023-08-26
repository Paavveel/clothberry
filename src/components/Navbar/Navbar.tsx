import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames';
import { menuItems } from 'config/routes';

import { MenuItems } from './MenuItems';
import styles from './Navbar.module.css';

export const Navbar: FC = () => {
  const [active, setActive] = useState(false);
  const handleActiveClass = () => {
    setActive((active) => !active);
  };
  return (
    <nav className={styles.nav}>
      <ul
        className={classNames({
          [styles['menu-active']]: active,
          [styles.menu]: !active,
        })}
      >
        <Link to='/' className={styles.menu__items} onClick={() => setActive(false)}>
          Home
        </Link>
        {menuItems.map((menu, index) => {
          return <MenuItems items={menu} key={index} />;
        })}
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
  );
};
