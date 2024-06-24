import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { OffersVisitsSection } from '@homzhub/common/src/components/molecules/OffersVisitsSection';
import { AssetListingVisits } from '@homzhub/common/src/domain/models/AssetListingVisits';
import { AssetOfferSummary } from '@homzhub/common/src/domain/models/AssetOfferSummary';
import { OffersVisitsType } from '@homzhub/common/src/constants/Offers';

interface IProps {
  propertyVisitsData: AssetListingVisits;
  propertyOffersData: AssetOfferSummary;
  propertyDetailTab?: boolean;
}

const LatestUpdates: FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const { propertyDetailTab, propertyVisitsData, propertyOffersData } = props;

  const { upcomingVisits, missedVisits, completedVisits } = propertyVisitsData;
  const { totalOffers, activeOffers, pendingOffers } = propertyOffersData;

  return (
    <>
      <Text type="small" style={styles.title} textType="semiBold">
        {t('assetDashboard:latestUpdates')}
      </Text>
      <OffersVisitsSection
        propertyDetailTab={propertyDetailTab}
        values={{
          [OffersVisitsType.offers]: [totalOffers, activeOffers, pendingOffers],
          [OffersVisitsType.visits]: [upcomingVisits, missedVisits, completedVisits],
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: theme.colors.darkTint4,
  },
});

export default LatestUpdates;
