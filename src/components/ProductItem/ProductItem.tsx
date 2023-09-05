import { FC } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link, useParams } from 'react-router-dom';

import classNames from 'classnames';

import { Image, Price } from '@commercetools/platform-sdk';

import styles from './Product.module.css';

interface LocalizedString {
  [key: string]: string;
}

interface Product {
  id: string;
  name: LocalizedString;
  description?: LocalizedString | undefined;
  masterVariant: {
    images?: Image[];
    prices?: Price[];
  };
  slug: LocalizedString;
}

interface ProductCardProps {
  product: Product;
}

export const ProductItem: FC<ProductCardProps> = ({ product }) => {
  const { name, description, masterVariant, slug } = product;
  const { en: currentSlug } = slug;
  const { images, prices } = masterVariant;
  const price = prices ? prices[0].value.centAmount / 100 : 0;
  const discount = prices ? prices[0].discounted?.value.centAmount : null;
  const code = prices ? prices[0].value.currencyCode : '';
  const { category, subcategory } = useParams();

  let productPath;

  if (subcategory) {
    productPath = `/${category}/${subcategory}/${currentSlug}`;
  } else {
    productPath = `/${category}/item/${currentSlug}`;
  }

  return (
    <div className={styles.product__item}>
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
        <a className={styles.bag} type='button' href='/'>
          <svg viewBox='0 0 23 27' xmlns='http://www.w3.org/2000/svg'>
            <path d='M17.1393 8.66664V6.29026C17.1393 5.54975 16.9935 4.81649 16.7101 4.13235C16.4267 3.4482 16.0113 2.82658 15.4877 2.30296C14.9641 1.77934 14.3425 1.36398 13.6583 1.0806C12.9742 0.797221 12.2409 0.651367 11.5004 0.651367C10.7599 0.651367 10.0267 0.797221 9.34252 1.0806C8.65838 1.36398 8.03676 1.77934 7.51314 2.30296C6.98952 2.82658 6.57416 3.4482 6.29078 4.13235C6.0074 4.81649 5.86154 5.54975 5.86154 6.29026V11.9291C5.86154 12.1428 5.94642 12.3477 6.09749 12.4988C6.24856 12.6498 6.45345 12.7347 6.6671 12.7347C6.88075 12.7347 7.08564 12.6498 7.23671 12.4988C7.38779 12.3477 7.47266 12.1428 7.47266 11.9291V10.2778H15.5282V8.66664H7.47266V6.29026C7.47266 5.22202 7.89701 4.19754 8.65236 3.44219C9.40772 2.68683 10.4322 2.26248 11.5004 2.26248C12.5687 2.26248 13.5931 2.68683 14.3485 3.44219C15.1039 4.19754 15.5282 5.22202 15.5282 6.29026V10.2778H16.3419C16.5555 10.2778 16.7504 10.2778 16.7504 10.2778H17.1393H21.1671V24.7778H1.83377V10.2778H5.86154V8.66664H0.222656V24.8503C0.222656 25.2583 0.384759 25.6497 0.673305 25.9382C0.96185 26.2268 1.3532 26.3889 1.76127 26.3889H21.2396C21.6477 26.3889 22.039 26.2268 22.3276 25.9382C22.6161 25.6497 22.7782 25.2583 22.7782 24.8503V8.66664H17.1393Z' />
          </svg>
        </a>
        <Link to={productPath} className={styles['more-btn']} state={{ productId: product.id }}>
          <span>Подробнее</span>
          <div className={styles.icon}>
            <svg className={styles.arrow} xmlns='http://www.w3.org/2000/svg'>
              <path d='M12 3.7v-.1-.1-.1c0-.1-.1-.1-.1-.2l-3-3C8.7 0 8.3 0 8.1.1s-.1.6 0 .8L10.3 3H.5c-.3 0-.5.2-.5.5s.2.5.5.5h9.8L8.1 6.1c-.1.2-.1.6 0 .8.2.1.6.1.8 0l3-3c0-.1 0-.1.1-.2z' />
            </svg>
          </div>
        </Link>
      </div>
      <p className={`${styles.product__description}`}>
        {description?.en.length && description?.en.length > 110
          ? `${description?.en.slice(0, 110)}...`
          : description?.en}
      </p>
      <p className={styles.product__title}>
        <span>{name.en}</span>
      </p>
    </div>
  );
};
