import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import UpdatePasswordForm from '@homzhub/mobile/src/screens/Asset/More/User/UpdatePasswordForm';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const UpdatePassword = (): React.ReactElement => {
  const { goBack, navigate } = useNavigation();
  const { t } = useTranslation();

  const navigateToForgotPassword = (): void => {
    navigate(ScreensKeys.ForgotPassword, { isFromMore: true });
  };

  const renderScreen = (children: React.ReactElement): React.ReactElement => {
    return (
      <UserScreen title={t('assetMore:more')} pageTitle={t('moreProfile:changePassword')} onBackPress={goBack}>
        {children}
      </UserScreen>
    );
  };
  return (
    <UpdatePasswordForm renderScreen={renderScreen} onGoBack={goBack} handleForgotPassword={navigateToForgotPassword} />
  );
};

export default UpdatePassword;
