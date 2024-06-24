import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ReactFacebookLoginInfo, ReactFacebookLoginProps } from 'react-facebook-login';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { History } from 'history';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { SocialAuthUtils } from '@homzhub/common/src/utils/SocialAuthUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import Facebook from '@homzhub/common/src/assets/images/facebook.svg';
import Google from '@homzhub/common/src/assets/images/google.svg';
import LinkedIn from '@homzhub/common/src/assets/images/linkedin.svg';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import CommonAuthenticationHoc from '@homzhub/common/src/components/organisms/CommonAuthenticationHOC';
import { SocialAuthProvider } from '@homzhub/common/src/domain/models/SocialAuthProvider';
import { ISocialUserData, SocialAuthKeys } from '@homzhub/common/src/constants/SocialAuthProviders';
import { IUserTokens } from '@homzhub/common/src/services/storage/StorageService';

interface IOwnProps {
  isFromLogin: boolean;
  onEmailLogin?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  history: History;
}

interface IDispatchProps {
  loginSuccess: (data: IUserTokens) => void;
}

type IProps = IOwnProps & IDispatchProps & WithTranslation;

interface IState {
  authProviders: SocialAuthProvider[];
}

class SocialMediaGateway extends React.PureComponent<IProps, IState> {
  public state = {
    authProviders: [],
  };

  public componentDidMount(): void {
    SocialAuthUtils.fetchSocialMedia((response) => {
      this.setState({ authProviders: response });
    });
  }

  public render(): React.ReactNode {
    const { isFromLogin, onEmailLogin, containerStyle } = this.props;
    const { authProviders } = this.state;
    return (
      <CommonAuthenticationHoc isFromLogin={isFromLogin} onEmailLogin={onEmailLogin} containerStyle={containerStyle}>
        <>
          {authProviders.map(
            (auth: SocialAuthProvider): React.ReactNode => (
              <React.Fragment key={auth.provider}>
                {auth.visible && this.getImageUrlForLib(auth.provider, auth.description)}
              </React.Fragment>
            )
          )}
        </>
      </CommonAuthenticationHoc>
    );
  }

  private onFacebookSuccess = (response: ReactFacebookLoginInfo): void => {
    const { email = '', accessToken, name = '' } = response;
    const nameParts = name.split(' ');
    const usableResult: ISocialUserData = {
      provider: SocialAuthKeys.Facebook,
      idToken: accessToken,
      user: {
        email,
        first_name: nameParts[0] ?? '',
        last_name: nameParts[1] ?? '',
      },
    };
    this.authenticateSocialData(usableResult);
  };

  private onFailureFacebook = (): void => {
    AlertHelper.error({ message: 'error logging in' });
  };

  private onFailureGoogle = (): void => {
    AlertHelper.error({ message: 'error logging in' });
  };

  private onSuccessGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
    if (this.hasResult(response)) {
      const { tokenObj, profileObj } = response;
      const usableResult: ISocialUserData = {
        provider: SocialAuthKeys.Google,
        idToken: tokenObj.id_token,
        user: {
          email: profileObj.email,
          first_name: profileObj.givenName,
          last_name: profileObj.familyName,
        },
      };

      this.authenticateSocialData(usableResult);
    }
  };

  private authenticateSocialData = (result: ISocialUserData): void => {
    const { loginSuccess, history, isFromLogin, t } = this.props;
    SocialAuthUtils.onSocialAuthSuccess(
      result,
      () => {
        let compProps;
        if (isFromLogin) {
          compProps = {
            socialUserData: result,
            title: t('auth:loginWithGoogle'),
            subTitle: result.user.email,
            buttonTitle: t('common:login'),
            underlineDesc: t('auth:authDescLogin', { username: result.user.first_name }),
            isFromLogin,
            isEmailLogin: false,
          };
        } else {
          compProps = {
            socialUserData: result,
            title: t('auth:signUpWithGoogle'),
            subTitle: result.user.email,
            buttonTitle: t('common:signUp'),
            underlineDesc: t('auth:authDescSignUp', { username: result.user.first_name }),
            isFromLogin: false,
            isEmailLogin: false,
          };
        }
        NavigationService.navigate(history, {
          path: RouteNames.publicRoutes.MOBILE_VERIFICATION,
          params: { ...compProps },
        });
      },
      (tokens) => {
        loginSuccess(tokens);
        NavigationService.navigate(history, {
          path: RouteNames.protectedRoutes.DASHBOARD,
        });
      }
    ).then();
  };

  private hasResult = (response: object): response is GoogleLoginResponse => {
    return (
      (response as GoogleLoginResponse).profileObj !== undefined &&
      (response as GoogleLoginResponse).getId() !== undefined
    );
  };

  private getImageUrlForLib = (key: string, description: string): React.ReactNode => {
    switch (key) {
      case SocialAuthKeys.Facebook:
        return (
          <FacebookLogin
            appId={ConfigHelper.getFacebookClientId()}
            fields="name,email"
            callback={this.onFacebookSuccess}
            onFailure={this.onFailureFacebook}
            render={(renderProps: ReactFacebookLoginProps): React.ReactNode => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus
              <div role="button" onClick={renderProps.onClick}>
                <TouchableOpacity disabled={renderProps.isDisabled} style={styles.alignToCenter}>
                  <Facebook height={24} width={24} />
                  <Label type="regular" textType="regular" style={styles.iconTextStyle}>
                    {description}
                  </Label>
                </TouchableOpacity>
              </div>
            )}
          />
        );
      case SocialAuthKeys.Google:
        return (
          <GoogleLogin
            clientId={ConfigHelper.getGoogleWebClientId()}
            render={(renderProps): JSX.Element => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus
              <div role="button" onClick={renderProps.onClick}>
                <TouchableOpacity disabled={renderProps.disabled} style={styles.alignToCenter}>
                  <Google height={24} width={24} />
                  <Label type="regular" textType="regular" style={styles.iconTextStyle}>
                    {description}
                  </Label>
                </TouchableOpacity>
              </div>
            )}
            onSuccess={this.onSuccessGoogle}
            onFailure={this.onFailureGoogle}
            cookiePolicy="single_host_origin"
          />
        );
      case SocialAuthKeys.LinkedIn:
        return <LinkedIn />;
      default:
        return null;
    }
  };
}

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { loginSuccess } = UserActions;
  return bindActionCreators(
    {
      loginSuccess,
    },
    dispatch
  );
};

const HOC = connect(null, mapDispatchToProps)(withTranslation()(SocialMediaGateway));
export { HOC as SocialMediaGateway };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  iconTextStyle: {
    marginTop: 4,
  },
  alignToCenter: {
    alignItems: 'center',
  },
});
