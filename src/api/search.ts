import { api } from './client';

export const getAllProducts = async (sortBy: string, color: string, size: string, price: string, brand: string) => {
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
        },
      })
      .execute();
    return response.body.results;
  } catch (error) {
    return false;
  }
};

export const getProductsByCategoryId = async (
  id: string,
  sortBy: string,
  color: string,
  size: string,
  price: string,
  brand: string
) => {
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
          limit: 100,
        },
      })
      .execute();
    return response.body.results;
  } catch (error) {
    return false;
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
) => {
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
        },
      })
      .execute();
    return response.body.results;
  } catch (error) {
    return false;
  }
};
