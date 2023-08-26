/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getCategoryBySlug, getProductsByCategoryId } from '@api/search';
import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductItem } from '@components/ProductItem/ProductItem';
import { NotFoundPage } from '@pages/NotFoundPage';

import styles from './ProductList.module.css';

export const ProductList: FC = () => {
  const { name } = useParams();
  const [products, setProducts] = useState<ProductProjection[]>([]);
  const [errorCategory, setErrorCategory] = useState(false);
  useEffect(() => {
    async function fetchRequest() {
      const res = await getCategoryBySlug(name!);
      if ('error' in res) {
        setErrorCategory(true);
      } else if ('body' in res) {
        const categoryId = res.body.id;
        const productsByCategory = (await getProductsByCategoryId(categoryId)).body.results;
        setProducts(productsByCategory);
      }
    }
    fetchRequest();
    return () => setErrorCategory(false);
  }, [name]);

  if (errorCategory) {
    return <NotFoundPage />;
  }
  return (
    <section className={styles['product-list']}>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </section>
  );
};
