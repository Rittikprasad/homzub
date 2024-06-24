import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import ConfirmationSheet from '@homzhub/mobile/src/components/molecules/ConfirmationSheet';
import QuotePaymentForm from '@homzhub/common/src/components/organisms/ServiceTickets/QuotePaymentForm';
import { InvoiceId } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const QuotePayment = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const { invoiceSummary } = useSelector(TicketSelectors.getTicketLoaders);
  const [isLoading, setLoading] = useState(false);

  const renderSheet = (callback: () => Promise<InvoiceId>, onClose: () => void): React.ReactElement => {
    const onCloseSheet = (): void => {
      onClose();
      goBack();
    };

    const onSubmit = async (): Promise<void> => {
      await callback();
      goBack();
    };

    return (
      <ConfirmationSheet
        isVisible
        message={t('payLaterConfirmation')}
        buttonTitles={[t('common:cancel'), t('common:continue')]}
        onCloseSheet={onCloseSheet}
        onPressDelete={onSubmit}
        primaryButtonStyle={styles.button}
      />
    );
  };

  return (
    <>
      <UserScreen
        loading={invoiceSummary || isLoading}
        title={selectedTicket?.propertyName ?? ''}
        pageTitle={t('quotePayment')}
        onBackPress={goBack}
      >
        <QuotePaymentForm payLaterSheet={renderSheet} onSuccess={goBack} setLoader={setLoading} />
      </UserScreen>
    </>
  );
};

export default QuotePayment;

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primaryColor,
  },
});
