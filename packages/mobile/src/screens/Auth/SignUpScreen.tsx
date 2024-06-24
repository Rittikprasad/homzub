import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { AuthenticationGateways } from '@homzhub/mobile/src/components';
import { SignUpForm } from '@homzhub/common/src/components/organisms/SignUpForm';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

type Props = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.SignUp>;

interface IOwnState {
  isLoading: boolean;
}

export class SignUpScreen extends Component<Props, IOwnState> {
  public state = {
    isLoading: false,
  };

  public render(): React.ReactNode {
    const {
      t,
      navigation,
      route: { params },
    } = this.props;
    const { isLoading } = this.state;

    return (
      <Screen
        headerProps={{
          type: 'secondary',
          icon: icons.close,
          onIconPress: this.onClosePress,
        }}
        pageHeaderProps={{
          contentTitle: t('signUp'),
          contentSubTitle: t('auth:alreadyRegistered'),
          contentLink: t('login'),
          onLinkPress: this.onLoginPress,
        }}
        backgroundColor={theme.colors.white}
        keyboardShouldPersistTaps
        isLoading={isLoading}
      >
        <>
          <SignUpForm
            onSubmitFormSuccess={this.onFormSubmit}
            onPressLink={this.handleTermsCondition}
            onPressPrivacyLink={this.handlePrivacy}
            referralCode={params && params?.referralCode}
            testID="signupForm"
          />
          {!PlatformUtils.isIOS() && (
            <AuthenticationGateways
              onSuccessCallback={params?.onCallback}
              toggleLoading={this.toggleLoading}
              isFromLogin={false}
              navigation={navigation}
            />
          )}
        </>
      </Screen>
    );
  }

  private onClosePress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private onLoginPress = (): void => {
    const {
      navigation,
      route: { params },
    } = this.props;
    const onCallback = params && params.onCallback ? { onCallback: params.onCallback } : {};
    navigation.navigate(ScreensKeys.Login, onCallback);
  };

  private onFormSubmit = async (formData: ISignUpPayload): Promise<void> => {
    const {
      navigation,
      t,
      route: { params },
    } = this.props;

    try {
      const isEmailUsed = await UserRepository.emailExists(formData.email);
      if (isEmailUsed.is_exists) {
        AlertHelper.error({ message: t('auth:emailAlreadyExists') });
        return;
      }

      const phone = `${formData.phone_code}~${formData.phone_number}`;
      const isPhoneUsed = await UserRepository.phoneExists(phone);
      if (isPhoneUsed.is_exists) {
        AlertHelper.error({ message: t('auth:phoneAlreadyExists') });
        return;
      }

      if (formData.signup_referral_code) {
        const isValidCode = await UserRepository.verifyReferalCode(formData.signup_referral_code);
        if (!isValidCode.is_applicable) {
          AlertHelper.error({ message: t('auth:invalidReferralCodeError') });
          return;
        }
      }

      navigation.navigate(ScreensKeys.OTP, {
        type: OtpNavTypes.SignUp,
        title: t('auth:verifyNumber') ?? '',
        countryCode: formData.phone_code,
        otpSentTo: formData.phone_number,
        userData: formData,
        ...(params && params.onCallback && { onCallback: params.onCallback }),
      });
    } catch (err) {
      console.log('🚀 ~ file: SignUpScreen.tsx ~ line 126 ~ SignUpScreen ~ onFormSubmit= ~ err.details', err.details);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
  };

  private handleTermsCondition = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.WebViewScreen, { url: 'https://www.homzhub.com/terms&Condition' });
  };

  private handlePrivacy = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.WebViewScreen, { url: 'https://www.homzhub.com/privacyPolicy' });
  };

  private toggleLoading = (isLoading: boolean): void => {
    this.setState({ isLoading });
  };
}

export default withTranslation()(SignUpScreen);
