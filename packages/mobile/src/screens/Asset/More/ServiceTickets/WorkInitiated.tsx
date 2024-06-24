import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import WorkInitiatedForm from '@homzhub/common/src/components/organisms/ServiceTickets/WorkInitiatedForm';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const WorkInitiated = (): ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  const [isLoading, setLoader] = useState(false);

  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);

  return (
    <UserScreen
      title={selectedTicket?.propertyName ?? ''}
      pageTitle={t('workInitiated')}
      onBackPress={goBack}
      loading={isLoading}
    >
      <WorkInitiatedForm toggleLoader={setLoader} onSubmit={goBack} />
    </UserScreen>
  );
};

export default WorkInitiated;
