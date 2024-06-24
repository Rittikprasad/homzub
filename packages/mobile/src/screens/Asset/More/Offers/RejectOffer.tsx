import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import RejectOfferForm from '@homzhub/common/src/components/organisms/RejectOfferForm';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const RejectOffer = (): React.ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.offers);
  return (
    <UserScreen title={t('common:offers')} pageTitle={t('rejectOffer')} onBackPress={goBack} loading={isLoading}>
      <RejectOfferForm setIsLoading={setIsLoading} goBack={goBack} />
    </UserScreen>
  );
};

export default RejectOffer;
