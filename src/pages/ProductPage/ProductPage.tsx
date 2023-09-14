import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import classNames from 'classnames';
import { type Swiper as SwiperRef } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { api } from '@api/client';
import { ProductProjection } from '@commercetools/platform-sdk';
import { Breadcrumbs } from '@components/Breadcrumbs/Breadcrumbs';
import { Button } from '@components/Button';
import { Fancybox } from '@components/Fancybox/Fancybox';
import { Loader } from '@components/Loader';
import { createCart, updateCart } from '@store/features/auth/cartApi';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import styles from './ProductPage.module.css';
import { OptionSize } from './types';

export const ProductPage = () => {
  const [data, setData] = useState<ProductProjection | null>(null);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectSize, setSelectSize] = useState('');

  const { id } = useParams();
  const dispatch = useAppDispatch();
  const cartId = useAppSelector((state) => state.auth.cart?.id);
  const cartVersion = useAppSelector((state) => state.auth.cart?.version);
  const lineItems = useAppSelector((state) => state.auth.cart?.lineItems);
  const swiperRef = useRef<SwiperRef>();

  const price = data && data.masterVariant.prices ? data.masterVariant.prices[0].value.centAmount / 100 : 0;
  const discount = data && data.masterVariant.prices ? data.masterVariant.prices[0].discounted?.value.centAmount : 0;
  const code = data && data.masterVariant.prices ? data.masterVariant.prices[0].value.currencyCode : 'EUR';
  const country = data && data.masterVariant.prices ? data.masterVariant.prices[0].country : 'eu';
  const correctPrice = new Intl.NumberFormat(country, {
    style: 'currency',
    currency: code,
  }).format(price);

  const variantSku =
    (selectSize &&
      data &&
      data.variants.find((variant) => {
        const size = variant.attributes?.find((attr) => attr.name === 'size');
        return size?.value.key === selectSize;
      })?.sku) ||
    data?.masterVariant.sku;

  const lineItem = lineItems?.find((item) => item.variant.sku === variantSku);

  const masterSize: string = useMemo(
    () => data?.masterVariant.attributes?.find((attr) => attr.name === 'size')?.value.key || '',
    [data]
  );
  const variantsSizes: string[] = useMemo(
    () =>
      data?.variants.map((variant) => {
        const size = variant.attributes?.find((attr) => attr.name === 'size');
        return size?.value.key;
      }) || [],
    [data]
  );

  const sizes: OptionSize[] = useMemo(
    () =>
      [masterSize, ...variantsSizes].map((size) => ({
        value: size,
        label: size.toUpperCase(),
      })),
    [masterSize, variantsSizes]
  );

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      if (cartId && cartVersion) {
        await dispatch(
          updateCart({
            cartId,
            body: {
              version: cartVersion,
              actions: [{ action: 'addLineItem', sku: variantSku }],
            },
          })
        ).unwrap();
      } else {
        await dispatch(createCart({ currency: 'USD', lineItems: [{ sku: variantSku }] })).unwrap();
      }
    } catch (error) {
      toast.error('Error with add to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFromCart = async () => {
    try {
      setLoading(true);
      if (cartId && cartVersion) {
        await dispatch(
          updateCart({
            cartId,
            body: {
              version: cartVersion,
              actions: [{ action: 'removeLineItem', lineItemId: lineItem?.id }],
            },
          })
        ).unwrap();
      }
    } catch (error) {
      toast.error('Error with remove from cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getProduct = async (id: string) => {
      try {
        const response = await api.request.productProjections().withId({ ID: id }).get().execute();
        setData(response.body);
      } catch (error) {
        setError(true);
        toast.error('Error with fetch product');
      } finally {
        setFetchingProduct(false);
      }
    };
    if (id) {
      getProduct(id);
    }
  }, [id]);

  if (fetchingProduct) return <Loader pageLoader />;
  if (error) return null;

  return (
    <>
      <Breadcrumbs productDetail={data ? data.name : undefined} />
      <section className={styles.product}>
        <div className={styles.img}>
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
              {data?.masterVariant.images?.map(({ url }, index) => (
                <SwiperSlide key={url} virtualIndex={index}>
                  <a data-fancybox='gallery' href={url}>
                    <img src={url} alt={`product ${index}`} width='100%' height='100%' />
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              slidesPerView={data?.masterVariant.images?.length}
              modules={[Thumbs]}
              className='mySwiper'
            >
              {data?.masterVariant.images?.map(({ url }, index) => (
                <SwiperSlide key={url} virtualIndex={index}>
                  <img src={url} alt={`product ${index}`} width='70' height='70' />
                </SwiperSlide>
              ))}
            </Swiper>
          </Fancybox>
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>{data?.name?.en}</h1>
          <div
            className={classNames(styles.price__current, {
              [styles.price__discount]: discount,
            })}
          >
            <span>{`${correctPrice}`}</span>
            {discount && (
              <span>
                {discount / 100}&nbsp;
                {code}
              </span>
            )}
          </div>

          <p className={styles.description}>{data?.description?.en}</p>
          <Select
            placeholder='Choose the size'
            options={sizes}
            defaultValue={sizes[0]}
            value={sizes.find((c) => c.value === selectSize)}
            onChange={(value) => {
              if (value) {
                setSelectSize(value.value);
              }
            }}
          />
          <Button
            type='button'
            className={styles.button}
            primary={!lineItem}
            secondary={!!lineItem}
            onClick={lineItem ? handleDeleteFromCart : handleAddToCart}
            loading={loading}
          >
            {lineItem ? 'Remove from cart' : 'Add to Cart'}
          </Button>
        </div>
      </section>
    </>
  );
};
