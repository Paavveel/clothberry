import { FC, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Menu } from 'config/routes';

import { Dropdown } from './Dropdown';
import styles from './Navbar.module.css';

interface MenuItemsProps {
  items: Menu;
}

export const MenuItems: FC<MenuItemsProps> = ({ items }) => {
  const [dropdown, setDropdown] = useState(false);

  const ref = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (dropdown && ref.current && !ref.current.contains(event.target as Node)) {
        setDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [dropdown]);

  const onMouseEnter = () => {
    if (window.innerWidth > 960) {
      setDropdown(true);
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth > 960) {
      setDropdown(false);
    }
  };

  const closeDropdown = () => {
    if (dropdown) {
      setDropdown(false);
    }
  };
  return (
    <li
      className={styles.menu__items}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={closeDropdown}
      onKeyDown={closeDropdown}
      role='presentation'
    >
      {items.submenu && (
        <>
          <button
            type='button'
            aria-haspopup='menu'
            onClick={() => setDropdown((prev) => !prev)}
            aria-expanded={dropdown ? 'true' : 'false'}
          >
            <Link to={items.url}>{items.title} </Link>
          </button>
          <Dropdown submenus={items.submenu} dropdown={dropdown} currentUrl={items.url} />
        </>
      )}
    </li>
  );
};
