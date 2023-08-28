/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getCategoryBySlug, getProductsByCategoryId, getProductsFilterByColor, getProductsSortBy } from '@api/search';
import { ProductProjection } from '@commercetools/platform-sdk';
import { Filter } from '@components/Filter/Filter';
import { ColourOption, Option, sortBy } from '@components/Filter/data';
import { ProductItem } from '@components/ProductItem/ProductItem';
import { NotFoundPage } from '@pages/NotFoundPage';

import styles from './ProductList.module.css';

export const ProductList: FC = () => {
  const { name } = useParams();
  const [products, setProducts] = useState<ProductProjection[]>([]);
  const [errorCategory, setErrorCategory] = useState(false);
  const [sortByPrice, setSortByPrice] = useState('');
  const [filterByColor, setFilterByColor] = useState('');
  const [idCategory, setIdCategory] = useState('');

  useEffect(() => {
    async function fetchRequest() {
      const res = await getCategoryBySlug(name!);
      if ('error' in res) {
        setErrorCategory(true);
      } else if ('body' in res) {
        const categoryId = res.body.id;
        const productsByCategory = (await getProductsByCategoryId(categoryId)).body.results;
        setProducts(productsByCategory);
        setIdCategory(categoryId);
      }
    }
    fetchRequest();
    return () => setErrorCategory(false);
  }, [name]);

  if (errorCategory) {
    return <NotFoundPage />;
  }

  const handleSortPrice = async (option: Option | null) => {
    if (option) {
      const { value } = option;
      if (value === sortByPrice) {
        return;
      }
      const res = await getProductsSortBy(value, idCategory);
      if ('error' in res) {
        setErrorCategory(true);
      } else if ('body' in res) {
        const sortedProducts = res.body.results;
        setProducts(sortedProducts);
        setSortByPrice(value);
      }
    }
  };

  const handleFilterColor = async (option: ColourOption | null) => {
    if (option) {
      const { value } = option;
      if (value === filterByColor) {
        return;
      }
      const res = await getProductsFilterByColor(value, idCategory);
      if ('error' in res) {
        setErrorCategory(true);
      } else if ('body' in res) {
        const sortedProducts = res.body.results;
        setProducts(sortedProducts);
        setFilterByColor(value);
      }
    }
  };

  console.log(sortByPrice);

  return (
    <div className={styles.products__wrapper}>
      <Filter handleSortPrice={handleSortPrice} handleFilterColor={handleFilterColor} />
      <section className={styles['product-list']}>
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
};
