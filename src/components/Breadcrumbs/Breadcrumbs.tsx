import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { LocalizedString } from '@commercetools/platform-sdk';

import styles from './Breadcrumbs.module.css';

interface BreadcrumbsProps {
  productDetail?: LocalizedString;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ productDetail }) => {
  const location = useLocation();

  let currentLink = '';

  const crumbs = location.pathname
    .split('/')
    .filter((crumb) => crumb !== '' && crumb !== 'item')
    .map((crumb, index, array) => {
      currentLink += `/${crumb}`;

      return (
        <div className={styles.crumb} key={crumb}>
          {index !== array.length - 1 ? (
            <Link to={currentLink}>{crumb}</Link>
          ) : (
            <span>{productDetail?.en.toLowerCase() ?? crumb}</span>
          )}
        </div>
      );
    });
  return <div className={styles.breadcrumbs}>{crumbs}</div>;
};
