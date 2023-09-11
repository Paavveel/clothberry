import dev2 from '@assets/images/alexey.jpg';
import dev1 from '@assets/images/pavel.jpeg';
import dev3 from '@assets/images/vladimir.jpg';
import { ReactComponent as School } from '@assets/img/school.svg';
import { Breadcrumbs } from '@components/Breadcrumbs/Breadcrumbs';

import style from './AboutPage.module.css';

export const AboutPage = () => {
  return (
    <section>
      <Breadcrumbs />
      <h1 className={style.title}>About us</h1>
      <p className={style.about}>
        <span className={style.school}>
          This project was implemented by a team of students from
          <a href='https://rs.school/' target='_blank' rel='noreferrer'>
            <School width='70' height='70' />
          </a>
        </span>
        The team communicated via discord. The project was maintained in github projects.
      </p>
      <div className={style.creator}>
        <div className={style['creator-img']}>
          <img src={dev1} alt='pavel' width='100%' height='100%' />
        </div>
        <span className={style['creator-title']}>Pavel, Team Leader</span>
        <p className={style['creator-description']}>
          Pavel realized login page, user profile, basket page, write a lot of tests and more useful things
        </p>
        <a className={style['creator-link']} href='https://github.com/Paavveel' target='_blank' rel='noreferrer'>
          Github
        </a>
      </div>
      <div className={style.creator}>
        <div className={style['creator-img']}>
          <img className={style['creator-img-alexey']} src={dev2} alt='alexey' width='100%' height='100%' />
        </div>
        <span className={style['creator-title']}>Alexey, right-hand Team-Leader</span>
        <p className={style['creator-description']}>
          Alexey realized catalog page, registration page, basket page, write some tests and more useful things
        </p>
        <a className={style['creator-link']} href='https://github.com/dedushkaalex' target='_blank' rel='noreferrer'>
          Github
        </a>
      </div>
      <div className={style.creator}>
        <div className={style['creator-img']}>
          <img src={dev3} alt='vladimir' width='100%' height='100%' />
        </div>
        <span className={style['creator-title']}>Vladimir, left-hand Team-Leader</span>
        <p className={style['creator-description']}>
          Vladimir realized product page, about page, main page and some useful things
        </p>
        <a className={style['creator-link']} href='https://github.com/noisekov' target='_blank' rel='noreferrer'>
          Github
        </a>
      </div>
    </section>
  );
};
