import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { NavigationService } from '@homzhub/mobile/src/services/NavigationService';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { LoginForm } from '@homzhub/common/src/components/organisms/LoginForm';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import {
  IEmailLoginPayload,
  ILoginFormData,
  ILoginPayload,
  LoginTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';

interface IStateProps {
  isLoading: boolean;
  redirectionDetails: IRedirectionDetails;
}

interface IDispatchProps {
  login: (payload: ILoginPayload) => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.EmailLogin>;
type Props = IDispatchProps & IStateProps & libraryProps;

export class EmailLoginScreen extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { t, isLoading } = this.props;
    return (
      <Screen
        containerStyle={styles.container}
        headerProps={{
          type: 'secondary',
          icon: icons.leftArrow,
          onIconPress: this.handleIconPress,
        }}
        pageHeaderProps={{
          contentTitle: t('auth:logInWithEmail'),
        }}
        backgroundColor={theme.colors.white}
        keyboardShouldPersistTaps
        isLoading={isLoading}
      >
        <LoginForm
          isEmailLogin
          handleForgotPassword={this.handleForgotPassword}
          onLoginSuccess={this.handleLoginSuccess}
          testID="loginForm"
        />
      </Screen>
    );
  }

  private handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private handleForgotPassword = (): void => {
    const {
      navigation,
      route: { params },
    } = this.props;
    const onCallback = params && params.onCallback ? { onCallback: params.onCallback } : {};
    navigation.navigate(ScreensKeys.ForgotPassword, onCallback);
  };

  private handleLoginSuccess = (values: ILoginFormData): void => {
    const {
      login,
      route: { params },
    } = this.props;

    const emailLoginData: IEmailLoginPayload = {
      action: LoginTypes.EMAIL,
      payload: {
        email: values.email,
        password: values.password,
      },
    };

    const loginPayload: ILoginPayload = {
      data: emailLoginData,
      ...(params && params.onCallback && { callback: params.onCallback }),
      handleDynamicLink: this.handleDynamicLink,
    };

    login(loginPayload);
  };

  private handleDynamicLink = (): void => {
    const { redirectionDetails } = this.props;
    if (redirectionDetails.shouldRedirect && redirectionDetails.redirectionLink) {
      NavigationService.handleDynamicLinkNavigation(redirectionDetails).then();
    }
  };
}

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    isLoading: UserSelector.getLoadingState(state),
    redirectionDetails: CommonSelectors.getRedirectionDetails(state) as IRedirectionDetails,
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

// @ts-ignore
export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(EmailLoginScreen));

// @ts-ignore
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});
