import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

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

export const ProductList: FC = () => {
  const { name } = useParams();
  const [products, setProducts] = useState<ProductProjection[]>([]);
  const [errorCategory, setErrorCategory] = useState(false);
  const [sortByNameAndPrice, setSortByNameAndPrice] = useState('');
  const [filterByColor, setFilterByColor] = useState('');
  const [filterBySize, setFilterBySize] = useState('');
  const [filterByPrice, setFilterByPrice] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();

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

  const handleFilterSize = (option: Option | null) => {
    if (option) {
      setFilterBySize(option.value);
    } else {
      setFilterBySize('');
    }
  };

  const handleFilterPrice = (option: Option | null) => {
    if (option) {
      setFilterByPrice(option.value);
    } else {
      setFilterByPrice('');
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
      if (name) {
        const categoryId = await getCategoryBySlug(name);
        if (categoryId) {
          const productsByCategory = await getProductsByCategoryId(
            categoryId,
            sortByNameAndPrice,
            filterByColor,
            filterBySize,
            filterByPrice
          );
          if (productsByCategory) {
            setProducts(productsByCategory);
            setIsLoading(false);
          }
        } else {
          setErrorCategory(true);
        }
      } else {
        getAllProducts(sortByNameAndPrice, filterByColor, filterBySize, filterByPrice).then((data) => {
          if (data) {
            setProducts(data);
            setIsLoading(false);
          }
        });
      }
    }
    if (!search.get('q')) {
      fetchRequest();
    } else {
      const queryString = search.get('q');
      if (queryString) {
        fetchSearchResults(queryString, sortByNameAndPrice, filterByColor, filterBySize, filterByPrice).then((data) => {
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
  }, [name, sortByNameAndPrice, filterByColor, errorCategory, search, filterBySize, filterByPrice]);

  if (errorCategory) {
    return <NotFoundPage />;
  }

  return (
    <div className={styles.products__wrapper}>
      <Breadcrumbs />
      <Filter
        handleSort={handleSort}
        handleFilterColor={handleFilterColor}
        handleSearch={handleSearch}
        handleFilterSize={handleFilterSize}
        handleFilterPrice={handleFilterPrice}
      />
      <section className={styles['product-list']}>
        {isLoading
          ? [...new Array(6)].map((_, index) => <Skeleton key={index} />)
          : products.map((product) => <ProductItem key={product.id} product={product} />)}

        {isLoading && <Skeleton />}
      </section>
    </div>
  );
};
