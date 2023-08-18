import classes from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  return (
    <div className='app container'>
      <h1 className={classes.title}>Страница не найдена</h1>
      <span>Неправильно набран адрес, или такой страницы на сайте больше не существует.</span>
    </div>
  );
};
