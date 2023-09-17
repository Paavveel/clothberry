import { availablePromo } from 'config/promo';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Img1 from '@assets/images/main-img-1.jpg';
import Img2 from '@assets/images/main-img-2.jpg';
import { CopyButton } from '@components/CopyButton/CopyButton';

import style from './HomePage.module.css';

export const HomePage = () => {
  return (
    <>
      <div className={style.home}>
        <div className={style['home-wrapper']}>
          <Swiper
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            className='mySwiper3'
          >
            <SwiperSlide>
              <img className={style.main__slider__img} src={Img1} alt='pic1' height='1920' width='1080' />
            </SwiperSlide>
            <SwiperSlide>
              <img className={style.main__slider__img} src={Img2} alt='pic2' height='1920' width='1080' />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      <h2 className={style.promo__title}>Available promo codes</h2>
      <ul className={style.promo__list}>
        {availablePromo.map(({ label, code }) => (
          <li key={code} className={style.promo__list__item}>
            <div className={style.promo__label}>{label}</div>
            <span className={style.promo__code}>{code}</span>
            <CopyButton value={code} />
          </li>
        ))}
      </ul>
    </>
  );
};
