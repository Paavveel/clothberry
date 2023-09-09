/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { debounce } from 'lodash';

import { fetchSearchResults, getAllProducts, getCategoryBySlug, getProductsByCategoryId } from '@api/search';
import { ProductProjection } from '@commercetools/platform-sdk';
import { Breadcrumbs } from '@components/Breadcrumbs/Breadcrumbs';
import { Filter } from '@components/Filter/Filter';
import { ColorOption, Option } from '@components/Filter/data';
import { ProductItem } from '@components/ProductItem/ProductItem';
import { Skeleton } from '@components/Skeleton/Skeleton';
import { NotFoundPage } from '@pages/NotFoundPage';

import styles from './ProductList.module.css';

type FilterType = 'color' | 'size' | 'brand' | 'price';

export const ProductList: FC = () => {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState<ProductProjection[]>([]);
  const [errorCategory, setErrorCategory] = useState(false);
  const [sortByNameAndPrice, setSortByNameAndPrice] = useState('');
  const [filterByColor, setFilterByColor] = useState('');
  const [filterBySize, setFilterBySize] = useState('');
  const [filterByPrice, setFilterByPrice] = useState('');
  const [filterByBrand, setFilterByBrand] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSort = (option: Option | null) => {
    if (option) {
      setSortByNameAndPrice(option.value);
    } else {
      setSortByNameAndPrice('');
    }
  };

  const handleFilter = (option: ColorOption | Option | null, type: FilterType): void => {
    switch (type) {
      case 'color':
        option ? setFilterByColor(option.value) : setFilterByColor('');
        break;
      case 'size':
        option ? setFilterBySize(option.value) : setFilterBySize('');
        break;
      case 'price':
        option ? setFilterByPrice(option.value) : setFilterByPrice('');
        break;
      case 'brand':
        option ? setFilterByBrand(option.value) : setFilterByBrand('');
        break;

      default:
        throw new Error('Invalid property type');
    }
  };

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text.length === 0) {
      search.delete('q');
      setSearch(search, {
        replace: true,
      });
    } else {
      search.set('q', text);
      setSearch(search, {
        replace: true,
      });
    }
    navigate(`/product-list-page?${search}`);
  }, 400);
  useEffect(() => {
    async function fetchRequest() {
      if (location.pathname === '/product-list-page') {
        getAllProducts(sortByNameAndPrice, filterByColor, filterBySize, filterByPrice, filterByBrand).then((data) => {
          if (data) {
            setProducts(data);
            setIsLoading(false);
          }
        });
        return;
      }
      const categoryId = await getCategoryBySlug(subcategory || category!);
      if (categoryId) {
        const productsByCategory = await getProductsByCategoryId(
          categoryId,
          sortByNameAndPrice,
          filterByColor,
          filterBySize,
          filterByPrice,
          filterByBrand
        );
        if (productsByCategory) {
          setProducts(productsByCategory);
          setIsLoading(false);
        }
      } else {
        setErrorCategory(true);
      }
    }
    if (!search.get('q')) {
      fetchRequest();
    } else {
      const queryString = search.get('q');
      if (queryString) {
        fetchSearchResults(
          queryString,
          sortByNameAndPrice,
          filterByColor,
          filterBySize,
          filterByPrice,
          filterByBrand
        ).then((data) => {
          if (data) {
            setProducts(data);
            setIsLoading(false);
          }
        });
      }
    }

    return () => {
      if (errorCategory) {
        setErrorCategory(false);
      }
    };
  }, [
    location,
    category,
    subcategory,
    sortByNameAndPrice,
    filterByColor,
    errorCategory,
    search,
    filterBySize,
    filterByPrice,
    filterByBrand,
  ]);

  if (errorCategory) {
    return <NotFoundPage />;
  }

  return (
    <div className={styles.products__wrapper}>
      <Filter handleSort={handleSort} handleSearch={handleSearch} handleFilter={handleFilter} />
      <Breadcrumbs />
      <section className={styles['product-list']}>
        {!isLoading && !products.length && <p className={styles.not__found__product}>Products not found</p>}
        {isLoading
          ? [...new Array(6)].map((_, index) => <Skeleton key={index} />)
          : products.map((product) => <ProductItem key={product.id} product={product} filterSize={filterBySize} />)}

        {isLoading && <Skeleton />}
      </section>
    </div>
  );
};
