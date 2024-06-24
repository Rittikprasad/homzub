import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import TicketDetail from '@homzhub/mobile/src/screens/Asset/More/ServiceTickets/components/TicketDetail';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
import { TicketActions as Actions } from '@homzhub/common/src/constants/ServiceTickets';

const RequestDetail = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { navigate, goBack } = useNavigation();
  const { t } = useTranslation();
  const currentTicket = useSelector(TicketSelectors.getCurrentTicket);
  const ticketDetails = useSelector(TicketSelectors.getTicketDetail);
  const { closeTicket, ticketReminder, ticketDetail: detailLoader } = useSelector(TicketSelectors.getTicketLoaders);

  useFocusEffect(
    useCallback(() => {
      if (currentTicket) {
        dispatch(FFMActions.getTicketDetail(currentTicket.ticketId));
      }
    }, [])
  );

  const handleGoBack = (): void => {
    dispatch(TicketActions.clearState());
    goBack();
  };

  const handleNavigation = (action: string): void => {
    switch (action) {
      case Actions.SUBMIT_QUOTE:
        navigate(ScreenKeys.SubmitQuote);
        break;
      case Actions.INITIATE_WORK:
        navigate(ScreenKeys.WorkInitiated);
        break;
      case Actions.WORK_COMPLETED:
        navigate(ScreenKeys.WorkCompleted);
        break;
      case Actions.SEND_UPDATES:
        navigate(ScreenKeys.SendUpdate);
        break;
      default:
        break;
    }
  };

  const renderScreen = (children: React.ReactElement): React.ReactElement => {
    const title = ticketDetails ? ticketDetails.asset.projectName : t('common:detail');
    return (
      <GradientScreen
        isUserHeader
        isScrollable
        screenTitle={title}
        onGoBack={handleGoBack}
        pageTitle={t('serviceTickets:ticketDetails')}
        loading={detailLoader || closeTicket || ticketReminder || !ticketDetails}
        containerStyle={styles.userScreen}
        pageHeaderStyle={styles.pageHeader}
      >
        {children}
      </GradientScreen>
    );
  };

  return <TicketDetail isFFMUser renderScreen={renderScreen} handleNavigation={handleNavigation} />;
};

export default RequestDetail;

const styles = StyleSheet.create({
  userScreen: {
    padding: 0,
  },
  pageHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 16,
  },
});
