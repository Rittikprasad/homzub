import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { Offer, OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { IOfferCompare } from '@homzhub/common/src/modules/offers/interfaces';

interface IProps {
  compareData: IOfferCompare;
  handleOfferAction: (value: OfferAction) => void;
}
const AcceptOffer: FC<IProps> = (props: IProps) => {
  const { compareData, handleOfferAction } = props;
  const { t } = useTranslation();
  const listingData = useSelector(OfferSelectors.getListingDetail);
  const offerData: Offer | null = useSelector(OfferSelectors.getCurrentOffer);
  if (!offerData || !listingData) return <EmptyState />;
  const handleAccept = (): void => {
    handleOfferAction(OfferAction.CONFIRMARION);
  };
  return (
    <View>
      <OfferCard offer={offerData} asset={listingData} isFromAccept compareData={compareData} />
      <Button
        type="primary"
        iconSize={20}
        icon={icons.circularCheckFilled}
        iconColor={theme.colors.green}
        title={t('common:accept')}
        onPress={handleAccept}
        containerStyle={styles.acceptButton}
        titleStyle={styles.acceptText}
      />
    </View>
  );
};
export default AcceptOffer;
const styles = StyleSheet.create({
  acceptButton: {
    marginHorizontal: 16,
    flexDirection: 'row-reverse',
    backgroundColor: theme.colors.greenOpacity,
    marginVertical: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptText: {
    marginHorizontal: 8,
    color: theme.colors.green,
  },
});
