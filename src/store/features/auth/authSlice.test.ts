import AuthReducer, { AuthState, clearError, logout } from './authSlice';

describe('authSlice', () => {
  const initialState: AuthState = {
    isLoggedIn: false,
    customer: null,
    cart: null,
    loading: false,
    errorMessage: '',
  };

  it('should handle initial state', () => {
    expect(AuthReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle logout', () => {
    const actual = AuthReducer(initialState, logout());
    expect(actual.isLoggedIn).toBeFalsy();
    expect(actual.customer).toBeNull();
  });

  it('should handle clearError', () => {
    const actual = AuthReducer(initialState, clearError());
    expect(actual.errorMessage).toEqual('');
  });
});
