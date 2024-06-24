import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useTranslation } from 'react-i18next';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import RequestQuoteForm from '@homzhub/common/src/components/organisms/ServiceTickets/RequestQuoteForm';
import ApproveQuote from '@homzhub/web/src/screens/serviceTickets/components/ApproveQuote';
import CloseTicket from '@homzhub/web/src/screens/serviceTickets/components/CloseTicket';
import PayLater from '@homzhub/web/src/screens/serviceTickets/components//PayLater';
import QuotePayment from '@homzhub/web/src/screens/serviceTickets/components/QuotePayment';
import ReassignTicket from '@homzhub/web/src/screens/serviceTickets/components/ReassignTicket';
import RejectTicket from '@homzhub/web/src/screens/serviceTickets/components/RejectTicket';
import RequestMoreQuotes from '@homzhub/web/src/screens/serviceTickets/components/RequestMoreQuotes';
import SubmitQuote from '@homzhub/web/src/screens/serviceTickets/components/SubmitQuote';
import UpdateWorkStatus from '@homzhub/web/src/screens/serviceTickets/components/UpdateWorkStatus';
import WorkCompleted from '@homzhub/web/src/screens/serviceTickets/components/WorkCompleted';
import WorkInitiated from '@homzhub/web/src/screens/serviceTickets/components/WorkInitiated';
import { TicketActions as TicketActionTypes } from '@homzhub/common/src/constants/ServiceTickets';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  popupRef: React.MutableRefObject<PopupActions | null>;
  activeTicketActionType: TicketActionTypes | null;
  onCloseModal: () => void;
  onSuccessCallback: (message?: string) => void;
  handleActiveTicketAction?: (value: TicketActionTypes) => void;
}

const ActiveTicketActionsPopover: React.FC<IProps> = (props: IProps) => {
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();
  const { activeTicketActionType, popupRef, onCloseModal, onSuccessCallback, handleActiveTicketAction } = props;
  const [category, setCategory] = useState({
    id: 0,
    name: '',
  });
  const onRequestMore = (id: number, name: string): void => {
    setCategory({ id, name });
    if (handleActiveTicketAction) {
      handleActiveTicketAction(TicketActionTypes.REQUEST_MORE_QUOTES);
    }
  };

  const renderActionsPopover = (): React.ReactNode | null => {
    switch (activeTicketActionType) {
      case TicketActionTypes.REQUEST_QUOTE:
        return <RequestQuoteForm onSuccess={onSuccessCallback} />;
      case TicketActionTypes.SUBMIT_QUOTE:
        return <SubmitQuote onSuccess={onSuccessCallback} />;
      case TicketActionTypes.APPROVE_QUOTE:
        return <ApproveQuote onSuccess={onSuccessCallback} onRequestMore={onRequestMore} />;
      case TicketActionTypes.REQUEST_MORE_QUOTES:
        return <RequestMoreQuotes onSuccess={onSuccessCallback} category={category} />;
      case TicketActionTypes.QUOTE_PAYMENT:
        if (handleActiveTicketAction) {
          return <QuotePayment onSuccess={onSuccessCallback} handleActiveTicketAction={handleActiveTicketAction} />;
        }
        return null;
      case TicketActionTypes.PAY_LATER:
        if (handleActiveTicketAction) {
          return <PayLater handleActiveTicketAction={handleActiveTicketAction} onSuccess={onSuccessCallback} />;
        }
        return null;
      case TicketActionTypes.REASSIGN_TICKET:
        return <ReassignTicket onSuccess={onSuccessCallback} />;
      case TicketActionTypes.INITIATE_WORK:
        return <WorkInitiated onSuccess={onSuccessCallback} />;
      case TicketActionTypes.WORK_COMPLETED:
        return <WorkCompleted onSuccess={onSuccessCallback} />;
      case TicketActionTypes.SEND_UPDATES:
        return <UpdateWorkStatus onSuccess={onSuccessCallback} />;
      case TicketActionTypes.REJECT_TICKET:
        return <RejectTicket onSuccess={onSuccessCallback} />;
      case TicketActionTypes.CLOSE_TICKET:
        return <CloseTicket onCloseModal={onCloseModal} />;
      default:
        return null;
    }
  };

  const serviceTicketsPopoverTypes = {
    [TicketActionTypes.REQUEST_QUOTE.toString()]: {
      title: t('serviceTickets:requestQuote'),
      styles: {
        height: '620px',
      },
    },
    [TicketActionTypes.SUBMIT_QUOTE.toString()]: {
      title: t('serviceTickets:submitQuote'),
      styles: {
        height: '620px',
      },
    },
    [TicketActionTypes.APPROVE_QUOTE.toString()]: {
      title: t('serviceTickets:approveQuote'),
      styles: {
        height: '620px',
      },
    },
    [TicketActionTypes.QUOTE_PAYMENT.toString()]: {
      title: t('serviceTickets:quotePayment'),
    },
    [TicketActionTypes.PAY_LATER.toString()]: {
      title: t('serviceTickets:payLater'),
    },
    [TicketActionTypes.REASSIGN_TICKET.toString()]: {
      title: t('serviceTickets:reassignRequest'),
    },
    [TicketActionTypes.INITIATE_WORK.toString()]: {
      title: t('serviceTickets:workInitiated'),
    },
    [TicketActionTypes.WORK_COMPLETED.toString()]: {
      title: t('serviceTickets:workCompleted'),
    },
    [TicketActionTypes.SEND_UPDATES.toString()]: {
      title: t('serviceTickets:sendUpdates'),
    },
    [TicketActionTypes.REJECT_TICKET.toString()]: {
      title: t('serviceTickets:rejectRequest'),
    },
    [TicketActionTypes.CLOSE_TICKET.toString()]: {
      title: t('serviceTickets:closeTicket'),
    },
  };
  const ServiceTicketsPopoverType =
    activeTicketActionType && serviceTicketsPopoverTypes[activeTicketActionType?.toString()];
  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography variant="text" size="small" fontWeight="bold">
            {ServiceTicketsPopoverType?.title}
          </Typography>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint7}
            onPress={onCloseCustom}
            containerStyle={styles.closeButton}
          />
        </View>
        <Divider containerStyles={styles.verticalStyle} />
        <View style={styles.modalContent}>{renderActionsPopover()}</View>
      </View>
    );
  };

  const onCloseCustom = (): void => {
    if (handleActiveTicketAction) {
      if (activeTicketActionType === TicketActionTypes.REQUEST_MORE_QUOTES) {
        handleActiveTicketAction(TicketActionTypes.APPROVE_QUOTE);
      } else if (activeTicketActionType === TicketActionTypes.PAY_LATER) {
        handleActiveTicketAction(TicketActionTypes.QUOTE_PAYMENT);
      } else {
        onCloseModal();
      }
    }
  };
  return (
    <Popover
      content={renderPopoverContent}
      popupProps={{
        closeOnDocumentClick: false,
        arrow: false,
        contentStyle: {
          maxHeight: '100%',
          alignItems: 'stretch',
          width: isMobile ? 320 : 400,
          borderRadius: 8,
          overflow: 'auto',
          ...ServiceTicketsPopoverType?.styles,
        },
        children: undefined,
        modal: true,
        position: 'center center',
        onClose: onCloseModal,
      }}
      forwardedRef={popupRef}
    />
  );
};

export default ActiveTicketActionsPopover;

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  modalContent: {
    padding: 24,
  },
  verticalStyle: {
    marginTop: 20,
  },
  closeButton: {
    zIndex: 1,
    position: 'absolute',
    right: 12,
    cursor: 'pointer',
    color: theme.colors.darkTint7,
  },
});
