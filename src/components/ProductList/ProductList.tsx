/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getCategoryBySlug, getProductsByCategoryId } from '@api/search';
import { ProductProjection } from '@commercetools/platform-sdk';
import { Filter } from '@components/Filter/Filter';
import { ColorOption, Option } from '@components/Filter/data';
import { ProductItem } from '@components/ProductItem/ProductItem';
import { NotFoundPage } from '@pages/NotFoundPage';

import styles from './ProductList.module.css';

export const ProductList: FC = () => {
  const { name } = useParams();
  const [products, setProducts] = useState<ProductProjection[]>([]);
  const [errorCategory, setErrorCategory] = useState(false);
  const [sortByNameAndPrice, setSortByNameAndPrice] = useState('');
  const [filterByColor, setFilterByColor] = useState('');

  const handleSort = (option: Option | null) => {
    if (option) {
      setSortByNameAndPrice(option.value);
    } else {
      setSortByNameAndPrice('');
    }
  };

  const handleFilterColor = (option: ColorOption | null) => {
    if (option) {
      setFilterByColor(option.value);
    } else {
      setFilterByColor('');
    }
  };

  useEffect(() => {
    async function fetchRequest() {
      const categoryId = await getCategoryBySlug(name!);
      if (categoryId) {
        const productsByCategory = await getProductsByCategoryId(categoryId, sortByNameAndPrice, filterByColor);
        if (productsByCategory) setProducts(productsByCategory);
      } else {
        setErrorCategory(true);
      }
    }
    fetchRequest();
    return () => {
      if (errorCategory) {
        setErrorCategory(false);
      }
    };
  }, [name, sortByNameAndPrice, filterByColor, errorCategory]);

  if (errorCategory) {
    return <NotFoundPage />;
  }

  return (
    <div className={styles.products__wrapper}>
      <Filter handleSort={handleSort} handleFilterColor={handleFilterColor} />
      <section className={styles['product-list']}>
        {products.length > 0 ? (
          products.map((product) => <ProductItem key={product.id} product={product} />)
        ) : (
          <p>Not found</p>
        )}
      </section>
    </div>
  );
};
