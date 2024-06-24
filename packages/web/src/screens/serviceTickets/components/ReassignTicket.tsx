import React, { ReactElement, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ReassignTicketForm from '@homzhub/common/src/components/organisms/ServiceTickets/ReassignTicketForm';

interface IProps {
  onSuccess: () => void;
}

const ReassignTicket: React.FC<IProps> = (props: IProps): ReactElement => {
  const dispatch = useDispatch();
  const { onSuccess } = props;
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const { assetUser: assetUsersLoading } = useSelector(AssetSelectors.getAssetLoaders);
  const { reassignTicket } = useSelector(TicketSelectors.getTicketLoaders);

  useEffect(() => {
    if (selectedTicket?.assetId) {
      dispatch(
        AssetActions.getAssetUsers({
          assetId: selectedTicket.assetId,
        })
      );
    }
  }, []);

  return (
    <View>
      <Loader visible={assetUsersLoading || reassignTicket} />
      <Typography variant="text" size="small" fontWeight="semiBold" style={styles.title}>
        {selectedTicket?.propertyName ?? ''}
      </Typography>
      <ReassignTicketForm onSuccess={onSuccess} />
    </View>
  );
};

export default ReassignTicket;

const styles = StyleSheet.create({
  title: {
    color: theme.colors.darkTint1,
  },
});
