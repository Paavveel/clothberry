import { forwardRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link, useParams } from 'react-router-dom';

import classNames from 'classnames';

import { ReactComponent as Arrow } from '@assets/img/arrow.svg';
import { ReactComponent as Basket } from '@assets/img/basket.svg';
import { ReactComponent as Minus } from '@assets/img/minus.svg';
import { ReactComponent as Plus } from '@assets/img/plus.svg';
import { ProductProjection } from '@commercetools/platform-sdk';
import { Loader } from '@components/Loader';
import { createCart, updateCart } from '@store/features/auth/cartApi';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import styles from './Product.module.css';

export type Ref = HTMLDivElement;

interface ProductCardProps {
  product: ProductProjection;
  filterSize: string;
}
export const ProductItem = forwardRef<Ref, ProductCardProps>(function ProductItem({ product, filterSize }, ref) {
  const { name, description, masterVariant, id } = product;
  const { images, prices } = masterVariant;
  const price = prices ? prices[0].value.centAmount / 100 : 0;
  const discount = prices ? prices[0].discounted?.value.centAmount : null;
  const code = prices ? prices[0].value.currencyCode : '';
  const { category, subcategory } = useParams();
  const dispatch = useAppDispatch();
  const cartId = useAppSelector((state) => state.auth.cart?.id);
  const cartVersion = useAppSelector((state) => state.auth.cart?.version);
  const lineItems = useAppSelector((state) => state.auth.cart?.lineItems);
  const [loading, setLoading] = useState(false);
  let productPath;
  if (category && subcategory) {
    productPath = `/${category}/${subcategory}/${id}`;
  } else if (category && !subcategory) {
    productPath = `/${category}/item/${id}`;
  } else {
    productPath = `item/${id}`;
  }

  const variantSku =
    (filterSize &&
      product.variants.find((variant) => {
        const size = variant.attributes?.find((attr) => attr.name === 'size');
        return size?.value.key === filterSize;
      })?.sku) ||
    product.masterVariant.sku;

  const lineItem = lineItems?.find((item) => item.variant.sku === variantSku);

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
      toast.error('Error with add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={ref} className={classNames(styles.product__item, { [styles.product__item_loading]: loading })}>
      <div className={styles['product__item--cover']}>
        <LazyLoadImage
          src={images && images.length > 0 ? images[0].url : ''}
          alt={name.en}
          width={300}
          height={300}
          effect='blur'
          placeholderSrc={images && images.length > 0 ? images[0].url : ''}
        />
        <div className={styles['black-mask']} />
        <div className={styles.price}>
          <div
            className={classNames(styles.price__current, {
              [styles.price__discount]: discount,
            })}
          >
            <span>
              {price}&nbsp;
              {code}
            </span>
            {discount && (
              <span>
                {discount / 100}&nbsp;
                {code}
              </span>
            )}
          </div>
        </div>
        {!loading && (
          <button className={styles.bag} type='button' onClick={lineItem ? handleDeleteFromCart : handleAddToCart}>
            <Basket />
            {lineItem ? <Minus className={styles.bag__minus} /> : <Plus className={styles.bag__plus} />}
          </button>
        )}
        {!loading ? (
          <Link to={productPath} className={styles['more-btn']}>
            <span>Подробнее</span>
            <div className={styles.icon}>
              <Arrow />
            </div>
          </Link>
        ) : (
          <Loader className={styles.product__loader} />
        )}
      </div>
      <p className={`${styles.product__description}`}>
        {description?.en.length && description?.en.length > 110
          ? `${description?.en.slice(0, 100)}...`
          : description?.en}
      </p>
      <p className={styles.product__title}>
        <span>{name.en}</span>
      </p>
    </div>
  );
});
