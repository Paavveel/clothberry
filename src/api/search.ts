import { ProductProjection } from '@commercetools/platform-sdk';

import { api } from './client';

export type ProductsResponse = {
  results: ProductProjection[];
  total?: number;
  count: number;
};

export const getAllProducts = async (
  sortBy: string,
  color: string,
  size: string,
  price: string,
  brand: string
): Promise<ProductsResponse | undefined> => {
  try {
    const response = await api.request
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: [
            `${color !== '' ? `variants.attributes.color.key:"${color}"` : ''}`,
            `${size !== '' ? `variants.attributes.size.key:"${size}"` : ''}`,
            `${price !== '' ? `variants.price.centAmount:range(${price})` : ''}`,
            `${brand !== '' ? `variants.attributes.brand.key:"${brand}"` : ''}`,
          ],
          sort: [`${sortBy !== '' ? sortBy : ''}`],
          limit: 6,
        },
      })
      .execute();
    return {
      results: response.body.results,
      total: response.body.total,
      count: response.body.count,
    };
  } catch {
    return undefined;
  }
};

export const getProductsByCategoryId = async (
  id: string,
  sortBy: string,
  color: string,
  size: string,
  price: string,
  brand: string
): Promise<ProductsResponse | undefined> => {
  let response;
  try {
    response = await api.request
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: [
            `categories.id:subtree("${id}")`,
            `${color !== '' ? `variants.attributes.color.key:"${color}"` : ''}`,
            `${size !== '' ? `variants.attributes.size.key:"${size}"` : ''}`,
            `${price !== '' ? `variants.price.centAmount:range(${price})` : ''}`,
            `${brand !== '' ? `variants.attributes.brand.key:"${brand}"` : ''}`,
          ],
          sort: [`${sortBy !== '' ? sortBy : ''}`],
        },
      })
      .execute();
    return {
      results: response.body.results,
      total: response.body.total,
      count: response.body.count,
    };
  } catch {
    return undefined;
  }
};
export const getCategoryBySlug = async (slug: string) => {
  let response;
  try {
    response = await api.request.categories().withKey({ key: slug }).get().execute();
    return response.body.id;
  } catch (error) {
    return false;
  }
};

export const fetchSearchResults = async (
  query: string,
  sortBy: string,
  color: string,
  size: string,
  price: string,
  brand: string
): Promise<ProductsResponse | undefined> => {
  let response;
  try {
    response = await api.request
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: [
            `${color !== '' ? `variants.attributes.color.key:"${color}"` : ''}`,
            `${size !== '' ? `variants.attributes.size.key:"${size}"` : ''}`,
            `${price !== '' ? `variants.price.centAmount:range(${price})` : ''}`,
            `${brand !== '' ? `variants.attributes.brand.key:"${brand}"` : ''}`,
          ],
          'text.en': query,
          fuzzy: true,
          sort: [`${sortBy !== '' ? sortBy : ''}`],
          limit: 6,
        },
      })
      .execute();
    return {
      results: response.body.results,
      total: response.body.total,
      count: response.body.count,
    };
  } catch {
    return undefined;
  }
};
