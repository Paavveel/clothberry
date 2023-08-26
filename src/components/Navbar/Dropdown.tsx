import { FC } from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames';
import { Menu } from 'config/routes';

import styles from './Navbar.module.css';

interface DropdownProps {
  submenus: Menu[];
  dropdown: boolean;
  currentUrl: string;
}

export const Dropdown: FC<DropdownProps> = ({ submenus, dropdown, currentUrl }) => {
  return (
    <ul
      className={classNames(styles.dropdown, {
        [styles.show]: dropdown,
      })}
    >
      {submenus.map((item, index) => (
        <li className={styles.menu__items} key={index}>
          <Link to={`${currentUrl}/${item.url}`}>{item.title}</Link>
        </li>
      ))}
    </ul>
  );
};
