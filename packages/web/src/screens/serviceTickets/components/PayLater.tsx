import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PaymentRepository } from '@homzhub/common/src/domain/repositories/PaymentRepository';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { InvoiceId } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { InvoiceActions } from '@homzhub/common/src/domain/repositories/interfaces';
import { TicketActions as TicketActionTypes } from '@homzhub/common/src/constants/ServiceTickets';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  handleActiveTicketAction: (value: TicketActionTypes) => void;
  onSuccess: () => void;
}

const PayLater: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { handleActiveTicketAction, onSuccess } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const summary = useSelector(TicketSelectors.getInvoiceSummary);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedTicket) {
      dispatch(
        TicketActions.getInvoiceSummary({
          action: InvoiceActions.TICKET_ORDER_SUMMARY,
          payload: {
            ticket: selectedTicket.ticketId,
          },
        })
      );
    }
  }, []);

  const onClose = (): void => {
    handleActiveTicketAction(TicketActionTypes.QUOTE_PAYMENT);
  };

  const generateInvoice = async (): Promise<InvoiceId> => {
    return await PaymentRepository.getInvoice({
      action: InvoiceActions.TICKET_INVOICE,
      payload: {
        ticket: selectedTicket?.ticketId ?? 0,
        ...(summary && { quotes: summary.userInvoiceItems.map((item) => item.id) }),
      },
    }).then((response) => {
      onSuccess();
      return response;
    });
  };
  const buttonTitles = [t('common:cancel'), t('common:continue')];
  return (
    <View>
      <Text type="small" style={styles.message}>
        {t('serviceTickets:payLaterConfirmation')}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          type="secondary"
          title={buttonTitles[0]}
          onPress={onClose}
          titleStyle={styles.buttonTitle}
          containerStyle={[styles.buttonGenric, styles.cancelButton]}
        />
        <Button
          type="primary"
          title={buttonTitles[1]}
          titleStyle={styles.buttonTitle}
          onPress={generateInvoice}
          // @ts-ignore
          containerStyle={[styles.buttonGenric, styles.primaryButtonStyle]}
        />
      </View>
    </View>
  );
};

export default PayLater;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
  },
  cancelButton: {
    marginLeft: 10,
    flexDirection: 'row-reverse',
    height: 50,
  },
  primaryButtonStyle: {
    flexDirection: 'row-reverse',
    height: 50,
    backgroundColor: theme.colors.primaryColor,
  },
  buttonTitle: {
    marginHorizontal: 4,
  },
  message: {
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonGenric: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
