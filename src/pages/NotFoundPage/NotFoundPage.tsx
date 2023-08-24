import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

import styles from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  const error = useRouteError();
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error';
  }
  return (
    <div className={styles.wrapper}>
      <span className={styles.numbers}>404</span>
      <h1 className={styles.title}>{errorMessage}</h1>
      <span className={styles.subtitle}>
        The address was typed incorrectly, or the page no longer exists on the site.
      </span>
      <Link className={styles['btn-home']} to='/'>
        Back
      </Link>
    </div>
  );
};
