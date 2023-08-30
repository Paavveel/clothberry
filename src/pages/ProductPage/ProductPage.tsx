import classes from './ProductPage.module.css';

export const ProductPage = () => {
  return (
    <div className={classes.product}>
      <div className={classes.img}> </div>
      <div className={classes.content}>
        <span className={classes.title}>Название товара</span>
        <p className={classes.description}>Описание товара</p>
      </div>
    </div>
  );
};
