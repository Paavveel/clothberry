import { useEffect, useState } from 'react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { api } from '@api/client';
import { Fancybox } from '@components/Fancybox/Fancybox';

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
        <Fancybox
          options={{
            Carousel: {
              infinite: false,
            },
          }}
        >
          <Swiper
            navigation
            pagination={{ clickable: true }}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[Navigation, Thumbs, Pagination]}
            className='mySwiper2'
          >
            {arrImage.map((arrImage, index) => (
              <SwiperSlide key={arrImage} virtualIndex={index}>
                <a data-fancybox='gallery' href={arrImage}>
                  <img src={arrImage} alt={`картинка ${index}`} width='100%' height='100%' />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper onSwiper={setThumbsSwiper} slidesPerView={arrImage.length} modules={[Thumbs]} className='mySwiper'>
            {arrImage.map((arrImage, index) => (
              <SwiperSlide key={arrImage} virtualIndex={index}>
                <img src={arrImage} alt={`картинка ${index}`} width='100%' height='100%' />
              </SwiperSlide>
            ))}
          </Swiper>
        </Fancybox>
      </div>

      <div className={classes.content}>
        <h1 className={classes.title}>{data.name?.en}</h1>
        <span className={classes.price}>{`${currentPrice}.00 ${code}`}</span>
        <p className={classes.description}>{data.description?.en}</p>
      </div>
    </section>
  );
};
