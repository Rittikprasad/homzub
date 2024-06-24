import React, { FC, useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
import { useDown, useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { LoginForm } from '@homzhub/common/src/components/organisms/LoginForm';
import { OtpNavTypes } from '@homzhub/web/src/components/organisms/OtpVerification';
import PhoneCodePrefix from '@homzhub/web/src/components/molecules/PhoneCodePrefix';
import UserValidationScreensTemplate from '@homzhub/web/src/components/hoc/UserValidationScreensTemplate';
import { SocialMediaGateway } from '@homzhub/web/src/components/organisms/SocialMediaGateway';
import { GetToKnowUsCarousel } from '@homzhub/web/src/components/organisms/GetToKnowUsCarousel';
import { IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  IEmailLoginPayload,
  ILoginFormData,
  ILoginPayload,
  LoginTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { ICommonState } from '@homzhub/common/src/modules/common/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IFormData {
  email: string;
  password: string;
}

interface IStateProps {
  commonLoaders: ICommonState['loaders'];
}

interface IDispatchProps {
  login: (payload: ILoginPayload) => void;
}

interface IOwnProps extends RouteComponentProps {
  isAuthenticated: boolean;
}

type IProps = IStateProps & IDispatchProps & IOwnProps;

const Login: FC<IProps> = (props: IProps) => {
  const { history, isAuthenticated, commonLoaders } = props;
  const { whileGetCountries } = commonLoaders;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);
  const styles = formStyles(isMobile, isDesktop);
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  const [isEmailLogin, setIsEmailLogin] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        if (PlatformUtils.isWeb()) {
          window.scrollTo(0, 0);
        }
      }, 100);
      NavigationService.navigate(history, {
        path: RouteNames.protectedRoutes.DASHBOARD,
      });
    }
  }, []);
  const navigateToHomeScreen = (): void => {
    setTimeout(() => {
      if (PlatformUtils.isWeb()) {
        window.scrollTo(0, 0);
      }
    }, 100);
    NavigationService.navigate(props.history, { path: RouteNames.protectedRoutes.DASHBOARD });
  };

  const handleSubmitEmailLogin = (values: IFormData): void => {
    // TODO: remove .logoutUser after logout functionality is implemented
    StoreProviderService.logoutUser();
    const emailLoginData: IEmailLoginPayload = {
      action: LoginTypes.EMAIL,
      payload: {
        email: values.email,
        password: values.password,
      },
    };

    const loginPayload: ILoginPayload = {
      data: emailLoginData,
      callback: navigateToHomeScreen,
    };
    props.login(loginPayload);
  };

  const handleEmailLogin = (): void => {
    setIsEmailLogin(true);
  };

  const backToLoginWithPhone = (): void => {
    setIsEmailLogin(false);
  };

  const handleForgotPassword = (): void => {
    // TODO: Add redirection logic for password reset.
  };
  const handleOtpLogin = (values: ILoginFormData): void => {
    const { phone_code, phone_number } = values;
    const compProps = {
      phoneCode: phone_code,
      otpSentTo: phone_number,
      type: OtpNavTypes.Login,
      buttonTitle: t('common:login'),
      navigationPath: RouteNames.publicRoutes.LOGIN,
    };
    NavigationService.navigate(props.history, {
      path: RouteNames.publicRoutes.OTP_VERIFICATION,
      params: { ...compProps },
    });
  };
  const navigateToScreen = (): void => {
    NavigationService.navigate(history, { path: RouteNames.publicRoutes.SIGNUP });
  };
  const handleWebView = (params: IWebProps): React.ReactElement => {
    return <PhoneCodePrefix {...params} />;
  };
  if (whileGetCountries) {
    return <Loader visible={whileGetCountries} />;
  }
  return (
    <View style={styles.container}>
      <UserValidationScreensTemplate
        title={t('login')}
        subTitle={isEmailLogin ? t('auth:loginToAccessHomzhubEmail') : t('auth:loginToAccessHomzhubPhone')}
        containerStyle={[styles.containerStyle, isTablet && styles.containerStyleTablet]}
        hasBackButton={isEmailLogin}
        backButtonPressed={backToLoginWithPhone}
      >
        <View style={styles.loginForm}>
          {isEmailLogin ? (
            <LoginForm
              isFromLogin
              isEmailLogin
              onLoginSuccess={handleSubmitEmailLogin}
              handleForgotPassword={handleForgotPassword}
              testID="loginFormWeb"
            />
          ) : (
            <LoginForm
              isFromLogin
              isEmailLogin={false}
              onLoginSuccess={handleOtpLogin}
              handleForgotPassword={handleForgotPassword}
              testID="loginFormWeb"
              webGroupPrefix={handleWebView}
            />
          )}
          <View style={styles.newUser}>
            <Typography variant="label" size="large">
              {t('auth:newOnPlatform')}
            </Typography>
            <TouchableOpacity onPress={navigateToScreen}>
              <Typography variant="label" size="large" fontWeight="semiBold" style={styles.createAccount}>
                {t('auth:createAccount')}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
        {isEmailLogin ? (
          <SocialMediaGateway isFromLogin containerStyle={styles.socialMediaContainer} history={history} />
        ) : (
          <SocialMediaGateway
            onEmailLogin={handleEmailLogin}
            isFromLogin
            containerStyle={styles.socialMediaContainer}
            history={history}
          />
        )}
      </UserValidationScreensTemplate>
      <GetToKnowUsCarousel />
    </View>
  );
};

interface IFormStyles {
  container: ViewStyle;
  containerStyle: ViewStyle;
  containerStyleTablet: ViewStyle;
  loginForm: ViewStyle;
  logo: ViewStyle;
  backButton: ViewStyle;
  newUser: ViewStyle;
  createAccount: ViewStyle;
  socialMediaContainer: ViewStyle;
}

const formStyles = (isMobile: boolean, isDesktop: boolean): StyleSheet.NamedStyles<IFormStyles> =>
  StyleSheet.create<IFormStyles>({
    container: {
      flex: 1,
      flexDirection: 'row',
      minHeight: '100vh',
    },
    containerStyle: {
      backgroundColor: theme.colors.white,
      width: '45%',
    },
    containerStyleTablet: {
      width: '100%',
    },
    socialMediaContainer: {
      marginTop: 36,
      alignSelf: 'center',
      width: isMobile ? '100%' : '50%',
    },
    loginForm: {
      width: isMobile ? '90%' : '55%',
      marginHorizontal: 'auto',
    },
    logo: {
      width: '100%',
      left: 0,
    },
    backButton: {
      left: 0,
      marginBottom: 25,
      marginTop: 50,
      borderWidth: 0,
      width: 'fit-content',
    },
    newUser: {
      flexDirection: 'row',
      top: 30,
    },
    createAccount: {
      color: theme.colors.primaryColor,
    },
  });

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    commonLoaders: CommonSelectors.getCommonLoaders(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { login } = UserActions;
  return bindActionCreators(
    {
      login,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, {}, IState>(mapStateToProps, mapDispatchToProps)(Login);
