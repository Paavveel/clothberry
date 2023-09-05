import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

import styles from './Breadcrumbs.module.css';

export const Breadcrumbs: FC = () => {
  const location = useLocation();

  let currentLink = '';

  const crumbs = location.pathname
    .split('/')
    .filter((crumb) => crumb !== '' && crumb !== 'item')
    .map((crumb, index, array) => {
      currentLink += `/${crumb}`;

      return (
        <div className={styles.crumb} key={crumb}>
          {index !== array.length - 1 ? <Link to={currentLink}>{crumb}</Link> : <span>{crumb}</span>}
        </div>
      );
    });
  return <div className={styles.breadcrumbs}>{crumbs}</div>;
};
