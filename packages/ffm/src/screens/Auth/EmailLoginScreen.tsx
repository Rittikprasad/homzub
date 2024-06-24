import React, {useState,useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { LoginForm } from '@homzhub/common/src/components/organisms/LoginForm';
import {
  IEmailLoginPayload,
  ILoginFormData,
  ILoginPayload,
  LoginTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { DynamicLinkTypes, RouteTypes } from '@homzhub/mobile/src/services/constants';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';

const EmailLoginScreen = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const loaders = useSelector(UserSelector.getUserLoaders);
  const [deepLinkUrl, setUrl] = useState('');

  useEffect(() => {
    CommonRepository.getDeepLink({
      action: 'MAIN',
      payload: {
        type: DynamicLinkTypes.UserProfile,
        routeType: RouteTypes.Private,
      },
    }).then((res) => {
      setUrl(res.deepLink);
    });
  }, []);
  
  const handleForgotPassword = (): void => {
    if (deepLinkUrl) {
      LinkingService.canOpenURL(deepLinkUrl).then();
    }
    console.log("hgfgg")
  };

  const handleLoginSuccess = (values: ILoginFormData): void => {
    const emailLoginData: IEmailLoginPayload = {
      action: LoginTypes.EMAIL,
      payload: {
        email: values.email,
        password: values.password,
      },
    };

    const loginPayload: ILoginPayload = {
      data: emailLoginData,
    };

    dispatch(UserActions.login(loginPayload));
  };
  const handleIconPress = (): void => {
    goBack();
  };

  return (
    <Screen
      containerStyle={styles.container}
      headerProps={{
        type: 'secondary',
        icon: icons.leftArrow,
        onIconPress: handleIconPress,
      }}
      pageHeaderProps={{
        contentTitle: t('auth:logInWithEmail'),
      }}
      backgroundColor={theme.colors.white}
      keyboardShouldPersistTaps
      isLoading={loaders.user}
    >
      <LoginForm isEmailLogin onLoginSuccess={handleLoginSuccess} handleForgotPassword={handleForgotPassword}/>
    </Screen>
  );
};

export default EmailLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});
