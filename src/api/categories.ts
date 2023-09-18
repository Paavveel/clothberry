import { api } from './client';

export const getCategories = async () => {
  try {
    const response = await api.request.categories().get().execute();
    return response.body.results;
  } catch (error) {
    return []; // Вернуть пустой массив в случае ошибки
  }
};
