import React, { ReactElement, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import RejectTicketForm from '@homzhub/common/src/components/organisms/ServiceTickets/RejectTicketForm';

interface IProps {
  onSuccess: () => void;
}

const RejectTicket: React.FC<IProps> = (props: IProps): ReactElement => {
  const { onSuccess } = props;
  const [isLoading, setLoader] = useState(false);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);

  return (
    <View>
      <Loader visible={isLoading} />
      <Typography variant="text" size="small" fontWeight="semiBold" style={styles.title}>
        {selectedTicket?.propertyName ?? ''}
      </Typography>
      <RejectTicketForm toggleLoader={setLoader} onSubmit={onSuccess} />
    </View>
  );
};

export default RejectTicket;

const styles = StyleSheet.create({
  title: {
    color: theme.colors.darkTint1,
  },
});
