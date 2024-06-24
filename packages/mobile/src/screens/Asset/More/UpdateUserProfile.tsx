import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import UpdateProfile, { UpdateUserFormTypes } from '@homzhub/mobile/src/screens/Asset/More/User/UpdateProfile';
import { IOtpNavProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const UpdateUserProfile = (): React.ReactElement => {
  const { params } = useRoute();
  const { goBack, navigate } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.moreProfile);
  const [isLoading, setLoading] = useState(false);

  const navigateToOtp = (navParams: IOtpNavProps): void => {
    navigate(ScreensKeys.OTP, navParams);
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
      <UserScreen title={t('assetMore:more')} loading={isLoading} pageTitle={getPageTitle()} onBackPress={goBack}>
        {children}
      </UserScreen>
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
