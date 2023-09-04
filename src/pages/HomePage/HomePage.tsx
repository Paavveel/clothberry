import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Img1 from '@assets/images/main-img-1.png';
import Img2 from '@assets/images/main-img-2.jpg';

import style from './HomePage.module.css';

export const HomePage = () => {
  return (
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
            <img src={Img1} alt='pic1' height='100%' width='100%' />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Img2} alt='pic2' height='100%' width='100%' />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};
