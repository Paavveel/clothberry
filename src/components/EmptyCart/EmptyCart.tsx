import { Link } from 'react-router-dom';

import cn from 'classnames';

import { ReactComponent as Basket } from '@assets/img/basket.svg';

import styles from './EmptyCart.module.css';

interface EmptyCartProps {
  className?: string;
}

export const EmptyCart = ({ className }: EmptyCartProps) => {
  return (
    <div className={cn(className, styles.empty__cart_wrapper)}>
      <div className={styles.empty__cart}>
        <Basket className={styles.empty__cart__icon} />
      </div>
      <p className={styles.empty__text}>You can add some product in the </p>
      <Link to='/product-list-page' className={styles.link}>
        Catalog
      </Link>
    </div>
  );
};
