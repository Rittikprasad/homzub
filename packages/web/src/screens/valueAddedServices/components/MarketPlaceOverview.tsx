import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import EstPortfolioValue from '@homzhub/web/src/components/molecules/EstPortfolioValue';
import OverviewCarousel, { IOverviewCarousalData } from '@homzhub/web/src/components/molecules/OverviewCarousel';
import { MetricsCount } from '@homzhub/common/src/domain/models/MetricsCount';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  onMetricsClicked: (name: string) => void;
  metricData: MetricsCount | undefined;
  activeMetric: string;
}

const MarketPlaceOverview: FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const { onMetricsClicked, metricData, activeMetric } = props;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  if (metricData === undefined) {
    return null;
  }
  const getMetricData = (): IOverviewCarousalData[] => {
    const { open } = metricData;
    return [
      {
        label: t('property:openServices'),
        count: open.count,
        colorCode: theme.colors.completed,
        icon: icons.settingOutline,
      },
      {
        label: t('property:totalServices'),
        count: metricData.count,
        colorCode: theme.colors.orange,
        icon: icons.settingOutline,
      },
    ];
  };

  return (
    <View style={[styles.container, isMobile && styles.mobileContainer]}>
      <EstPortfolioValue
        propertiesCount={metricData.count}
        title={t('property:totalServices')}
        icon={icons.settingOutline}
        iconColor={theme.colors.primaryColor}
        isHeaderText={false}
      />
      <OverviewCarousel
        data={getMetricData()}
        onMetricsClicked={onMetricsClicked}
        isActive={activeMetric}
        isCarousel={false}
        isIcon={!isMobile}
      />
    </View>
  );
};
export default MarketPlaceOverview;

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
