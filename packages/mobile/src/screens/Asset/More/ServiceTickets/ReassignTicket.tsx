import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import ReassignTicketForm from '@homzhub/common/src/components/organisms/ServiceTickets/ReassignTicketForm';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const ReassignTicket = (): ReactElement => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

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
    <UserScreen
      title={selectedTicket?.propertyName ?? ''}
      pageTitle={t('reassignRequest')}
      onBackPress={goBack}
      loading={assetUsersLoading || reassignTicket}
    >
      <ReassignTicketForm onSuccess={goBack} />
    </UserScreen>
  );
};

export default ReassignTicket;
