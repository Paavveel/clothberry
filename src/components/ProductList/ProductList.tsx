/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getCategoryBySlug, getProductsByCategoryId } from '@api/search';
import { ProductProjection } from '@commercetools/platform-sdk';
import { Filter } from '@components/Filter/Filter';
import { ColourOption, Option } from '@components/Filter/data';
import { ProductItem } from '@components/ProductItem/ProductItem';
import { NotFoundPage } from '@pages/NotFoundPage';

import styles from './ProductList.module.css';

export const ProductList: FC = () => {
  const { name } = useParams();
  const [products, setProducts] = useState<ProductProjection[]>([]);
  const [errorCategory, setErrorCategory] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [filterByColor, setFilterByColor] = useState('');

  useEffect(() => {
    async function fetchRequest() {
      const res = await getCategoryBySlug(name!);
      if ('error' in res) {
        setErrorCategory(true);
      } else if ('body' in res) {
        const categoryId = res.body.id;
        const productsByCategory = (await getProductsByCategoryId(categoryId, sortBy, filterByColor)).body.results;
        setProducts(productsByCategory);
      }
    }
    fetchRequest();
    return () => setErrorCategory(false);
  }, [name, sortBy, filterByColor]);

  if (errorCategory) {
    return <NotFoundPage />;
  }

  const handleSort = async (option: Option | null) => {
    if (option && option.value !== sortBy) {
      setSortBy(option.value);
    }
  };

  const handleFilterColor = async (option: ColourOption | null) => {
    if (option && option.value !== filterByColor) {
      setFilterByColor(option.value);
    }
  };

  console.log(sortBy);
  console.log(filterByColor);

  return (
    <div className={styles.products__wrapper}>
      <Filter handleSort={handleSort} handleFilterColor={handleFilterColor} />
      <section className={styles['product-list']}>
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
};
