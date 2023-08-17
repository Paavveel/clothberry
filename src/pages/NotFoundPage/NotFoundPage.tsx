import classes from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  return (
    <div>
      <h1 className={classes.title}>Страница не найден</h1>
      <h2>Неправильно набран адрес, или такой страницы на сайте больше не существует.</h2>
    </div>
  );
};
