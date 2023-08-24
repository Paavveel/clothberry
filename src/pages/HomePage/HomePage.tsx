import { Link } from 'react-router-dom';

import classes from './HomePage.module.css';

export const HomePage = () => {
  return (
    <div className={classes.home}>
      <div className={classes.links}>
        <Link className={classes['home-btn']} to='/signin'>
          Sign in
        </Link>
        <Link className={classes['home-btn']} to='/signup'>
          Sign up
        </Link>
      </div>
      <h1>Main page</h1>
    </div>
  );
};
