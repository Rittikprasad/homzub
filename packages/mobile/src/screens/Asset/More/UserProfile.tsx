import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import Profile from '@homzhub/mobile/src/screens/Asset/More/User/Profile';
import { UpdateUserFormTypes } from '@homzhub/mobile/src/screens/Asset/More/User/UpdateProfile';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const UserProfile = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { params } = useRoute();
  const { navigate, goBack } = useNavigation();

  useFocusEffect(
    useCallback(() => {
      dispatch(UserActions.getUserProfile());
    }, [])
  );

  const onUpdateProfile = (title?: string, formType?: UpdateUserFormTypes): void => {
    navigate(ScreensKeys.UpdateUserProfileScreen, { title, formType });
  };

  const onChangePassword = (): void => {
    navigate(ScreensKeys.UpdatePassword);
  };

  const renderScreen = (children: React.ReactElement): React.ReactElement => {
    const title = params && params.screenTitle ? params.screenTitle : t('assetMore:more');
    return (
      <UserScreen
        title={title}
        onBackPress={goBack}
        headerStyle={styles.headerStyle}
        pageTitle={t('assetMore:profile')}
        backgroundColor={theme.colors.background}
      >
        {children}
      </UserScreen>
    );
  };

  return <Profile renderScreen={renderScreen} onUpdateProfile={onUpdateProfile} onChangePassword={onChangePassword} />;
};

export default UserProfile;

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: theme.colors.white,
  },
});
