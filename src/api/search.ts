import { api } from './client';

export const getAllProducts = () => api.request.productProjections().get().execute();

export const getProductsByCategoryId = (id: string) =>
  api.request
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: `categories.id:subtree("${id}")`,
      },
    })
    .execute();
export const getCategoryBySlug = async (slug: string) => {
  try {
    const response = await api.request.categories().withKey({ key: slug }).get().execute();
    return response;
  } catch (error) {
    console.error('Error fetching category:', error);
    return { error: 'An error occurred while fetching the category.' };
  }
};

export const getProductsSortBy = async (optionValue: string, category: string) => {
  try {
    const response = await api.request
      .productProjections()
      .search()
      .get({
        queryArgs: {
          sort: optionValue,
          filter: `categories.id:subtree("${category}")`,
        },
      })
      .execute();
    return response;
  } catch (error) {
    console.error('Error fetching category:', error);
    return { error: 'An error occurred while fetching the sortBy.' };
  }
};

export const getProductsFilterByColor = async (optionValue: string, category: string) => {
  console.log(optionValue);
  try {
    const response = await api.request
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: [`categories.id:subtree("${category}")`, `variants.attributes.color.key:"${optionValue}"`],
        },
      })
      .execute();
    return response;
  } catch (error) {
    console.error('Error fetching category:', error);
    return { error: 'An error occurred while fetching the sortBy.' };
  }
};
