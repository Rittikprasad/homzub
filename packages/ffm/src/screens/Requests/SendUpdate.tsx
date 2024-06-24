import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import UpdateTicketStatusForm from '@homzhub/common/src/components/organisms/ServiceTickets/UpdateTicketStatusForm';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const SendUpdate = (): ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  const [isLoading, setLoader] = useState(false);

  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);

  return (
    <GradientScreen
      isUserHeader
      isScrollable
      loading={isLoading}
      onGoBack={goBack}
      pageTitle={t('sendUpdates')}
      screenTitle={selectedTicket?.propertyName ?? ''}
    >
      <UpdateTicketStatusForm toggleLoader={setLoader} isLoading={isLoading} onSubmit={goBack} />
    </GradientScreen>
  );
};

export default React.memo(SendUpdate);
