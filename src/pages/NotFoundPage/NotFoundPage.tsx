import classes from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  return (
    <div className='app container'>
      <h1 className={classes.title}>404 Not Found</h1>
      <span>The address was typed incorrectly, or the page no longer exists on the site.</span>
    </div>
  );
};
