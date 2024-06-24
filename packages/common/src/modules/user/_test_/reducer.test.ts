// @ts-nocheck
import { userReducer as reducer, initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { loginPayload } from '@homzhub/common/src/mocks/UserRepositoryMocks';

describe('User Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'INITIAL_STATE' })).toEqual(initialUserState);
  });

  it('should handle login', () => {
    const state = reducer(initialUserState, UserActions.login(loginPayload));
    expect(state).toStrictEqual({
      ...initialUserState,
      ['loaders']: { ...state.loaders, ['user']: true },
      ['error']: { ...state.error, ['user']: '' },
    });
  });

  it('should handle login Success', () => {
    const state = reducer(
      initialUserState,
      UserActions.loginSuccess({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      })
    );
    expect(state).toStrictEqual({
      ...initialUserState,
      ['tokens']: {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      },
      ['loaders']: { ...state.loaders, ['user']: false },
    });
  });

  it('should handle login failure', () => {
    const state = reducer(initialUserState, UserActions.logoutFailure('Test Error'));
    expect(state).toStrictEqual({
      ...initialUserState,
      ['loaders']: { ...state.loaders, ['user']: false },
      ['error']: { ...state.error, ['user']: 'Test Error' },
    });
  });

  it('should handle logout', () => {
    const state = reducer(initialUserState, UserActions.logout(loginPayload));
    expect(state).toStrictEqual({
      ...initialUserState,
      ['loaders']: { ...state.loaders, ['user']: true },
      ['error']: { ...state.error, ['user']: '' },
    });
  });

  it('should handle logout Success', () => {
    const state = reducer(initialUserState, UserActions.logoutSuccess());
    expect(state).toStrictEqual({
      ...initialUserState,
      ['tokens']: null,
      ['loaders']: { ...state.loaders, ['user']: false },
    });
  });

  it('should handle logout failure', () => {
    const state = reducer(initialUserState, UserActions.logoutFailure('Test Error'));
    expect(state).toStrictEqual({
      ...initialUserState,
      ['loaders']: { ...state.loaders, ['user']: false },
      ['error']: { ...state.error, ['user']: 'Test Error' },
    });
  });

  it('should handle update onBoarding', () => {
    const state = reducer(initialUserState, UserActions.updateOnBoarding(true));
    expect(state).toStrictEqual({
      ...initialUserState,
      ['isOnBoardingCompleted']: true,
    });
  });

  it('should set value of change stack', () => {
    const state = reducer(initialUserState, UserActions.setChangeStack(true));
    expect(state).toStrictEqual({
      ...initialUserState,
      ['isChangeStack']: true,
    });
  });
});
