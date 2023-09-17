const TOKEN = 'token';
const ANONYMOUS_TOKEN = 'anonymousToken';

export const setTokenInStorage = (id: string) => {
  localStorage.setItem(TOKEN, id);
};

export const removeTokenFromStorage = () => {
  localStorage.removeItem(TOKEN);
};

export const getTokenFromStorage = () => {
  return localStorage.getItem(TOKEN);
};

export const setAnonymousTokenInStorage = (id: string) => {
  localStorage.setItem(ANONYMOUS_TOKEN, id);
};

export const removeAnonymousTokenFromStorage = () => {
  localStorage.removeItem(ANONYMOUS_TOKEN);
};

export const getAnonymousTokenFromStorage = () => {
  return localStorage.getItem(ANONYMOUS_TOKEN);
};
