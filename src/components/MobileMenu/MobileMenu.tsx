import { FC, memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames';
import { menuItems } from 'config/routes';

import { useClickOutside } from '@hooks/useClickOutside';

import styles from './MobileMenu.module.css';

export const MobileMenu: FC = memo(function MobileMenu() {
  const [active, setActive] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const handleActiveClass = () => {
    setActive((active) => !active);
  };
  useClickOutside(mobileMenuRef, () => setActive(false));

  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [active]);
  return (
    <div className={styles.mobile__menu} ref={mobileMenuRef}>
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
      <nav
        className={classNames(styles.nav, {
          [styles.show]: active,
        })}
      >
        <ul className={styles.menu__list}>
          <Link to='/' className={styles.menu__items} onClick={handleActiveClass}>
            Home
          </Link>
          {menuItems.map((menu, index) => (
            <li key={index}>
              <Link to={menu.url} onClick={handleActiveClass}>
                {menu.title}
              </Link>
              {menu.submenu && menu.submenu.length > 0 && (
                <ul className={`${styles.menu__list} ${styles.menu__list__submenu}`}>
                  {menu.submenu.map((submenu, sumbenuIndex) => (
                    <li key={sumbenuIndex}>
                      <Link to={`${menu.url}/${submenu.url}`} onClick={handleActiveClass}>
                        {submenu.title}{' '}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <Link to='/about' className={styles.menu__items}>
            About
          </Link>
        </ul>
      </nav>
      <div className={active ? styles.overlay : ''} />
    </div>
  );
});
