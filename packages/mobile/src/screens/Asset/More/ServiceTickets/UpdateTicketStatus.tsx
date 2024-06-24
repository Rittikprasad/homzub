import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import UpdateTicketStatusForm from '@homzhub/common/src/components/organisms/ServiceTickets/UpdateTicketStatusForm';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const UpdateTicketStatus = (): ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  const [isLoading, setLoader] = useState(false);

  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);

  return (
    <UserScreen
      title={selectedTicket?.propertyName ?? ''}
      pageTitle={t('sendUpdates')}
      onBackPress={goBack}
      loading={isLoading}
    >
      <UpdateTicketStatusForm toggleLoader={setLoader} isLoading={isLoading} onSubmit={goBack} />
    </UserScreen>
  );
};

export default React.memo(UpdateTicketStatus);
