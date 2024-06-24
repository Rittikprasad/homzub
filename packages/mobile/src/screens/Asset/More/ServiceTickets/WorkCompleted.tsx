import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import WorkComplete from '@homzhub/mobile/src/screens/Asset/More/ServiceTickets/components/WorkComplete';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const WorkCompleted = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { navigate, goBack } = useNavigation();

  const [isLoading, setLoader] = useState(false);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  // HANDLERS
  const onGoBack = (): void => {
    dispatch(TicketActions.clearState());
    goBack();
  };

  const onSuccess = (): void => {
    navigate(ScreensKeys.ServiceTicketDetail);
  };

  // HANDLERS

  const renderScreen = (children: React.ReactElement): React.ReactElement => {
    return (
      <UserScreen
        loading={isLoading}
        onBackPress={onGoBack}
        pageTitle={t('workCompleted')}
        title={selectedTicket?.propertyName ?? ''}
      >
        {children}
      </UserScreen>
    );
  };

  return <WorkComplete renderScreen={renderScreen} setLoader={setLoader} onSuccess={onSuccess} />;
};

export default WorkCompleted;
