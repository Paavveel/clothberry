import { useEffect, useState } from 'react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { api } from '@api/client';

import classes from './ProductPage.module.css';

export const ProductPage = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetch = async (id: string) => {
      let response;
      try {
        response = await api.request.productProjections().withId({ ID: id }).get().execute();
        return response.body;
      } catch (error) {
        console.error('Error fetching product:', error);
        return false;
      }
    };
    fetch('9de39ac5-f559-4e53-a82f-4d5eeb4457f8').then((response) => setData(response));
  }, []);

  const arrImage: string[] = [];
  data.masterVariant?.images.forEach((item) => {
    arrImage.push(item.url);
  });

  const price = data.masterVariant?.prices[0].value.centAmount;
  const currentPrice = price / 100;
  const code = data.masterVariant?.prices[0].value.currencyCode;

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return (
    <section className={classes.product}>
      <div className={classes.img}>
        <Swiper
          loop={!true}
          navigation={!true}
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs, Pagination]}
          className='mySwiper2'
        >
          {arrImage.map((arrImage, index) => (
            <SwiperSlide key={arrImage} virtualIndex={index}>
              <img src={arrImage} alt='da' width='100%' height='100%' />
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={!true}
          slidesPerView={arrImage.length}
          pagination={{ clickable: true }}
          freeMode={!true}
          watchSlidesProgress={!true}
          modules={[FreeMode, Navigation, Thumbs, Pagination]}
          className='mySwiper'
        >
          {arrImage.map((arrImage, index) => (
            <SwiperSlide key={arrImage} virtualIndex={index}>
              <img src={arrImage} alt='da' width='100%' height='100%' />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={classes.content}>
        <h1 className={classes.title}>{data.name?.en}</h1>
        <span className={classes.price}>{`${currentPrice}.00 ${code}`}</span>
        <p className={classes.description}>{data.description?.en}</p>
      </div>
    </section>
  );
};
