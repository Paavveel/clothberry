import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';
import { getTokenFromStorage, setTokenInStorage } from '@helpers/TokenStorage';

export class AppTokenCache implements TokenCache {
  public tokenStore: TokenStore = {
    expirationTime: 0,
    token: getTokenFromStorage() ?? '',
    refreshToken: '',
  };

  get() {
    return this.tokenStore;
  }

  set(cache: TokenStore) {
    this.tokenStore = cache;
    setTokenInStorage(this.tokenStore.token);
  }
}
