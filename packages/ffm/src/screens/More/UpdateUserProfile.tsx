import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '@homzhub/common/src/styles/theme';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import UpdateProfile, { UpdateUserFormTypes } from '@homzhub/mobile/src/screens/Asset/More/User/UpdateProfile';
import { IOtpNavProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const UpdateUserProfile = (): React.ReactElement => {
  const { params } = useRoute();
  const { goBack, navigate } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.moreProfile);
  const [isLoading, setLoading] = useState(false);

  const navigateToOtp = (navParams: IOtpNavProps): void => {
    navigate(ScreensKeys.MobileVerification, navParams);
  };

  const getPageTitle = (): string => {
    if (!params) {
      return t('editProfile');
    }

    const { title, formType } = params;

    switch (formType) {
      case UpdateUserFormTypes.EmergencyContact:
        return t('editContactDetails');
      case UpdateUserFormTypes.WorkInfo:
        return t('editHeaderText', { title });
      default:
        return title as string;
    }
  };

  const renderScreen = (children: React.ReactElement): React.ReactElement => {
    return (
      <GradientScreen
        isUserHeader
        isScrollable
        onGoBack={goBack}
        loading={isLoading}
        pageTitle={getPageTitle()}
        pageHeaderStyle={styles.headerStyle}
        screenTitle={t('assetMore:more')}
        containerStyle={styles.screenContainer}
      >
        {children}
      </GradientScreen>
    );
  };

  return (
    <UpdateProfile
      renderScreen={renderScreen}
      navigateToOtp={navigateToOtp}
      formType={params?.formType}
      setLoading={setLoading}
    />
  );
};

export default UpdateUserProfile;

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
