import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import EstPortfolioValue from '@homzhub/web/src/components/molecules/EstPortfolioValue';
import OverviewCarousel, { IOverviewCarousalData } from '@homzhub/web/src/components/molecules/OverviewCarousel';
import { OfferManagement } from '@homzhub/common/src/domain/models/OfferManagement';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  onMetricsClicked: (name: string) => void;
  offerCountData: OfferManagement;
  isActive: string;
}
const OffersOverview: FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const { onMetricsClicked, offerCountData, isActive } = props;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const getMetricData = (): IOverviewCarousalData[] => {
    const { offerReceived, offerMade } = offerCountData;
    return [
      {
        label: t('offers:offerReceived'),
        count: offerReceived,
        colorCode: theme.colors.highPriority,
        icon: icons.offers,
      },
      { label: t('offers:offerMade'), count: offerMade, colorCode: theme.colors.greenTint8, icon: icons.offers },
    ];
  };

  if (offerCountData === undefined) {
    return null;
  }
  return (
    <View style={[styles.container, isMobile && styles.mobileContainer]}>
      <EstPortfolioValue
        propertiesCount={offerCountData.totalOffers}
        title={t('assetPortfolio:totalOffers')}
        icon={icons.offers}
        iconColor={theme.colors.primaryColor}
        isHeaderText={false}
      />
      <OverviewCarousel
        data={getMetricData()}
        onMetricsClicked={onMetricsClicked}
        isActive={isActive}
        isCarousel={false}
        isIcon={!isMobile}
      />
    </View>
  );
};
export default OffersOverview;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'space-between',
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    width: '100%',
    flexDirection: 'row',
  },
  mobileContainer: {
    flexDirection: 'column',
    paddingHorizontal: 10,
  },
});
