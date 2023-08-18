import classes from './HomePage.module.css';

export const HomePage = () => {
  return (
    <div className='app container'>
      <header className={classes.header}>
        <ul className={classes.header__items}>
          <li className={classes.header__item}>Новинки</li>
          <li className={classes.header__item}>Одежда</li>
          <li className={classes.header__item}>Аксессуары</li>
          <li className={classes.header__item}>SALE</li>
        </ul>
        <a href='/'>
          <img src='./src/assets/images/logo.png' alt='logo' />
        </a>
        <input type='text' />
        <button type='button'>login</button>
        <button type='button'>registration</button>
      </header>
    </div>
  );
};
