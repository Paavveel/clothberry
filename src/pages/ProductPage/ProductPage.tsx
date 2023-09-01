import { useEffect, useState } from 'react';

import { api } from '@api/client';

import classes from './ProductPage.module.css';

export const ProductPage = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetch = async (id: string) => {
      let response;
      try {
        response = await api.request.productProjections().withId({ ID: id }).get().execute();
        return response.body;
      } catch (error) {
        console.error('Error fetching product:', error);
        return false;
      }
    };
    fetch('9de39ac5-f559-4e53-a82f-4d5eeb4457f8').then((response) => setData(response));
  }, []);

  const price = data.masterVariant?.prices[0].value.centAmount;
  const currentPrice = price / 100;
  const code = data.masterVariant?.prices[0].value.currencyCode;
  return (
    <section className={classes.product}>
      <div className={classes.img}> </div>
      <div className={classes.content}>
        <h1 className={classes.title}>{data.name?.en}</h1>
        <span className={classes.price}>{`${currentPrice} ${code}`}</span>
        <p className={classes.description}>{data.description?.en}</p>
      </div>
    </section>
  );
};
