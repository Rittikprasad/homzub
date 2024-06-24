import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { AuthenticationGateways } from '@homzhub/mobile/src/components/organisms/AuthenticationGateways';
import { LoginForm } from '@homzhub/common/src/components/organisms/LoginForm';
import { ILoginFormData } from '@homzhub/common/src/domain/repositories/interfaces';
import { OtpNavTypes } from '@homzhub/mobile/src/navigation/interfaces';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

const LoginScreen = (): React.ReactElement => {
  const { t } = useTranslation();
  const { goBack, navigate } = useNavigation();
  const loaders = useSelector(UserSelector.getUserLoaders);

  const onClosePress = (): void => {
    goBack();
  };

  const onOtpLoginPress = (values: ILoginFormData): void => {
    navigate(ScreenKeys.MobileVerification, {
      type: OtpNavTypes.Login,
      title: t('auth:loginOtp') ?? '',
      countryCode: values.phone_code,
      otpSentTo: values.phone_number,
    });
  };

  const onEmailLoginPress = (): void => {
    navigate(ScreenKeys.EmailLogin);
  };
  return (
    <Screen
      headerProps={{
        type: 'secondary',
        icon: icons.close,
        onIconPress: onClosePress,
      }}
      pageHeaderProps={{
        contentTitle: t('login'),
      }}
      backgroundColor={theme.colors.white}
      isLoading={loaders.user}
    >
      <>
        <LoginForm onLoginSuccess={onOtpLoginPress} />
        <AuthenticationGateways isFromLogin isSocialAllowed={false} onEmailLogin={onEmailLoginPress} />
      </>
    </Screen>
  );
};

export default LoginScreen;
