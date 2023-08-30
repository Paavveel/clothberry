import { api } from './client';

export const getAllProducts = () => api.request.productProjections().get().execute();

export const getProductsByCategoryId = async (id: string, sortBy: string, color: string) => {
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
          ],
          sort: [`${sortBy !== '' ? sortBy : ''}`],
        },
      })
      .execute();
    return response.body.results;
  } catch (error) {
    console.error('Error fetching product:', error);
    return false;
  }
};
export const getCategoryBySlug = async (slug: string) => {
  let response;
  try {
    response = await api.request.categories().withKey({ key: slug }).get().execute();
    return response.body.id;
  } catch (error) {
    console.error('Error fetching category:', error);
    return false;
  }
};
