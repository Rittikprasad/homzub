import { UserActions, UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { ILoginPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { loginWithCallback, userData, userLogout } from '@homzhub/common/src/mocks/UserRepositoryMocks';

describe('User Actions', () => {
  it('should call login action', () => {
    const action = UserActions.login(loginWithCallback as ILoginPayload);
    expect(action).toStrictEqual({
      type: UserActionTypes.AUTH.LOGIN,
      payload: loginWithCallback,
    });
  });

  it('should call login success action', () => {
    const action = UserActions.loginSuccess(userData);
    expect(action).toStrictEqual({
      type: UserActionTypes.AUTH.LOGIN_SUCCESS,
      payload: userData,
    });
  });

  it('should call login failure action', () => {
    const action = UserActions.loginFailure('Test Error');
    expect(action).toStrictEqual({
      type: UserActionTypes.AUTH.LOGIN_FAILURE,
      error: 'Test Error',
    });
  });

  it('should call logout IAuthaction', () => {
    const action = UserActions.logout(userLogout);
    expect(action).toStrictEqual({
      type: UserActionTypes.AUTH.LOGOUT,
      payload: userLogout,
    });
  });

  it('should call logout success action', () => {
    const action = UserActions.logoutSuccess();
    expect(action).toStrictEqual({
      type: UserActionTypes.AUTH.LOGOUT_SUCCESS,
    });
  });

  it('should call logout failure action', () => {
    const action = UserActions.logoutFailure('Test Error');
    expect(action).toStrictEqual({
      type: UserActionTypes.AUTH.LOGOUT_FAILURE,
      error: 'Test Error',
    });
  });

  it('should call update onBoarding action', () => {
    const action = UserActions.updateOnBoarding(true);
    expect(action).toStrictEqual({
      type: UserActionTypes.UPDATE.ONBOARDING,
      payload: true,
    });
  });

  it('should set value of change stack', () => {
    const action = UserActions.setChangeStack(true);
    expect(action).toStrictEqual({
      type: UserActionTypes.SET.CHANGE_STACK,
      payload: true,
    });
  });
});
