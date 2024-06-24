import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import UpdatePasswordForm from '@homzhub/mobile/src/screens/Asset/More/User/UpdatePasswordForm';
import { DynamicLinkTypes, RouteTypes } from '@homzhub/mobile/src/services/constants';

const UpdatePassword = (): React.ReactElement => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
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

  const navigateToForgotPassword = (): void => {
    if (deepLinkUrl) {
      LinkingService.canOpenURL(deepLinkUrl).then();
    }
  };

  const renderScreen = (children: React.ReactElement): React.ReactElement => {
    return (
      <GradientScreen
        isUserHeader
        onGoBack={goBack}
        screenTitle={t('assetMore:more')}
        pageTitle={t('moreProfile:changePassword')}
      >
        {children}
      </GradientScreen>
    );
  };

  return (
    <UpdatePasswordForm renderScreen={renderScreen} onGoBack={goBack} handleForgotPassword={navigateToForgotPassword} />
  );
};

export default UpdatePassword;
