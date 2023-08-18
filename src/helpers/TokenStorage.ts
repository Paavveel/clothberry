const TOKEN = 'token';

export const setTokenInStorage = (id: string) => {
  localStorage.setItem(TOKEN, id);
};

export const removeTokenFromStorage = () => {
  localStorage.removeItem(TOKEN);
};

export const getTokenFromStorage = () => {
  return localStorage.getItem(TOKEN);
};
