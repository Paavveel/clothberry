import { useEffect, useRef, useState } from 'react';

import { type Swiper as SwiperRef } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { api } from '@api/client';
import { Image, LocalizedString, Price } from '@commercetools/platform-sdk';
import { Fancybox } from '@components/Fancybox/Fancybox';
import { Loader } from '@components/Loader';

import classes from './ProductPage.module.css';

interface Product {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  masterVariant: {
    images?: Image[];
    prices?: Price[];
  };
}

export const ProductPage = () => {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const swiperRef = useRef<SwiperRef>();

  const arrImage: string[] = [];
  const { name, description, masterVariant } = data || ({} as Product);
  const { images, prices } = masterVariant || ({} as Product);
  images?.forEach((item: Image) => {
    arrImage.push(item.url);
  });

  const price = prices ? prices[0].value.centAmount / 100 : '';
  const code = prices ? prices[0].value.currencyCode : '';

  useEffect(() => {
    const getProduct = async (id: string) => {
      let response;
      try {
        setLoading(true);
        response = await api.request.productProjections().withId({ ID: id }).get().execute();
        return response.body;
      } catch (error) {
        console.error('Error fetching product:', error);
        return false;
      } finally {
        setLoading(false);
      }
    };
    getProduct('9de39ac5-f559-4e53-a82f-4d5eeb4457f8').then((response) => {
      if (response) {
        setData(response);
      }
    });
  }, []);

  return (
    <section className={classes.product}>
      {loading && <Loader pageLoader />}
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
            thumbs={{ swiper: swiperRef.current }}
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
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            slidesPerView={arrImage.length}
            modules={[Thumbs]}
            className='mySwiper'
          >
            {arrImage.map((arrImage, index) => (
              <SwiperSlide key={arrImage} virtualIndex={index}>
                <img src={arrImage} alt={`картинка ${index}`} width='100%' height='100%' />
              </SwiperSlide>
            ))}
          </Swiper>
        </Fancybox>
      </div>
      <div className={classes.content}>
        <h1 className={classes.title}>{name?.en}</h1>
        <span className={classes.price}>{`${price} ${code}`}</span>
        <p className={classes.description}>{description?.en}</p>
      </div>
    </section>
  );
};
