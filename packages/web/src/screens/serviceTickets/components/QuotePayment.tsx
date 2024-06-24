import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import QuotePaymentForm from '@homzhub/common/src/components/organisms/ServiceTickets/QuotePaymentForm';
import { TicketActions as TicketActionTypes } from '@homzhub/common/src/constants/ServiceTickets';

interface IProps {
  onSuccess: () => void;
  handleActiveTicketAction: (value: TicketActionTypes) => void;
}

const QuotePayment: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { onSuccess, handleActiveTicketAction } = props;
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const { invoiceSummary } = useSelector(TicketSelectors.getTicketLoaders);
  const [isLoading, setLoading] = useState(false);

  return (
    <View>
      <Loader visible={invoiceSummary || isLoading} />
      <Typography variant="text" size="small" fontWeight="semiBold" style={styles.title}>
        {selectedTicket?.propertyName ?? ''}
      </Typography>
      <QuotePaymentForm
        onSuccess={onSuccess}
        setLoader={setLoading}
        handleActiveTicketAction={handleActiveTicketAction}
      />
    </View>
  );
};

export default QuotePayment;

const styles = StyleSheet.create({
  title: {
    color: theme.colors.darkTint1,
  },
});
