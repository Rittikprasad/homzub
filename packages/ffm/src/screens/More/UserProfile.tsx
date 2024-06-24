import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import Profile from '@homzhub/mobile/src/screens/Asset/More/User/Profile';
import { UpdateUserFormTypes } from '@homzhub/mobile/src/screens/Asset/More/User/UpdateProfile';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

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
    navigate(ScreenKeys.UpdateUserProfile, { title, formType });
  };

  const onChangePassword = (): void => {
    navigate(ScreenKeys.UpdatePassword);
  };

  const renderScreen = (children: React.ReactElement): React.ReactElement => {
    const title = params && params.screenTitle ? params.screenTitle : t('assetMore:more');
    return (
      <GradientScreen
        isUserHeader
        isScrollable
        onGoBack={goBack}
        screenTitle={title}
        pageTitle={t('assetMore:profile')}
        containerStyle={styles.screenContainer}
        pageHeaderStyle={styles.headerStyle}
      >
        {children}
      </GradientScreen>
    );
  };
  return (
    <Profile
      renderScreen={renderScreen}
      onUpdateProfile={onUpdateProfile}
      onChangePassword={onChangePassword}
      verification_id={params?.verification_id}
    />
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: theme.colors.background,
    padding: 0,
  },
  headerStyle: {
    backgroundColor: theme.colors.white,
    padding: 16,
    marginBottom: 0,
    marginTop: 0,
  },
});
