import { Link } from 'react-router-dom';

import styles from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.numbers}>404</span>
      <h1 className={styles.title}>Page Not Found</h1>
      <span className={styles.subtitle}>
        The address was typed incorrectly, or the page no longer exists on the site.
      </span>
      <Link className={styles['btn-home']} to='/'>
        Back
      </Link>
    </div>
  );
};
