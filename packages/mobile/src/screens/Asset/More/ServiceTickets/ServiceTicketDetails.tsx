import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import TicketDetail from '@homzhub/mobile/src/screens/Asset/More/ServiceTickets/components/TicketDetail';
import HandleBack from '@homzhub/mobile/src/navigation/HandleBack';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { TicketActions as Actions } from '@homzhub/common/src/constants/ServiceTickets';

const ServiceTicketDetails = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { navigate, goBack } = useNavigation();
  const { params } = useRoute();
  const { t } = useTranslation();
  const currentTicket = useSelector(TicketSelectors.getCurrentTicket);
  const ticketDetails = useSelector(TicketSelectors.getTicketDetail);
  const { closeTicket, ticketReminder, ticketDetail: detailLoader } = useSelector(TicketSelectors.getTicketLoaders);

  useFocusEffect(
    useCallback(() => {
      if (currentTicket) {
        dispatch(TicketActions.getTicketDetail(currentTicket.ticketId));
      }
    }, [])
  );

  const handleGoBack = (): void => {
    dispatch(TicketActions.clearState());
    // @ts-ignore
    if (params && params.isFromScreen) {
      navigate(ScreensKeys.ServiceTicketScreen, { isFromScreenLevel: true });
    } else {
      goBack();
    }
  };

  const handleNavigation = (action: string): void => {
    switch (action) {
      case Actions.REQUEST_QUOTE:
        navigate(ScreensKeys.RequestQuote);
        break;
      case Actions.SUBMIT_QUOTE:
        navigate(ScreensKeys.SubmitQuote);
        break;
      case Actions.APPROVE_QUOTE:
        navigate(ScreensKeys.ApproveQuote);
        break;
      case Actions.INITIATE_WORK:
        navigate(ScreensKeys.WorkInitiated);
        break;
      case Actions.WORK_COMPLETED:
        navigate(ScreensKeys.WorkCompleted);
        break;
      case Actions.SEND_UPDATES:
        navigate(ScreensKeys.UpdateTicketStatus);
        break;
      case Actions.REASSIGN_TICKET:
        navigate(ScreensKeys.ReassignTicket);
        break;
      case Actions.QUOTE_PAYMENT:
        navigate(ScreensKeys.QuotePayment);
        break;
      default:
        break;
    }
  };

  const renderScreen = (children: React.ReactElement): React.ReactElement => {
    const title = ticketDetails ? ticketDetails.asset.projectName : t('common:detail');
    return (
      <HandleBack onBack={handleGoBack}>
        <UserScreen
          title={title}
          onBackPress={handleGoBack}
          contentContainerStyle={styles.userScreen}
          pageTitle={t('serviceTickets:ticketDetails')}
          loading={detailLoader || closeTicket || ticketReminder}
        >
          {children}
        </UserScreen>
      </HandleBack>
    );
  };

  return <TicketDetail renderScreen={renderScreen} handleNavigation={handleNavigation} />;
};

export default ServiceTicketDetails;

const styles = StyleSheet.create({
  userScreen: {
    paddingBottom: 0,
  },
});
