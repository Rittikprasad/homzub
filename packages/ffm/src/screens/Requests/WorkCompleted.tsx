import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import WorkComplete from '@homzhub/mobile/src/screens/Asset/More/ServiceTickets/components/WorkComplete';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
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
    navigate(ScreenKeys.RequestDetail);
  };

  // HANDLERS

  const renderScreen = (children: React.ReactElement): React.ReactElement => {
    return (
      <GradientScreen
        isUserHeader
        isScrollable
        loading={isLoading}
        onGoBack={onGoBack}
        pageTitle={t('workCompleted')}
        screenTitle={selectedTicket?.propertyName ?? ''}
      >
        {children}
      </GradientScreen>
    );
  };

  return <WorkComplete renderScreen={renderScreen} setLoader={setLoader} onSuccess={onSuccess} />;
};

export default WorkCompleted;
