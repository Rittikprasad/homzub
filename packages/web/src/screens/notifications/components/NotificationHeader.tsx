import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import OverviewCarousel, { IOverviewCarousalData } from '@homzhub/web/src/components/molecules/OverviewCarousel';
import EstPortfolioValue from '@homzhub/web/src/components/molecules/EstPortfolioValue';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  onMetricsClicked: (name: string) => void;
  portfolioMetrics: IOverviewCarousalData[];
  countMetrics: number;
}

const NotificationHeader: React.FC<IProps> = (props: IProps) => {
  const { onMetricsClicked, portfolioMetrics, countMetrics } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.landing);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = propertyOverviewStyle(isMobile);

  const total = portfolioMetrics?.length ?? 0;
  return (
    <View style={styles.container}>
      <EstPortfolioValue
        icon={icons.bell}
        iconColor={theme.colors.green}
        title={t('assetMore:newNotification')}
        propertiesCount={countMetrics}
        headerText={t('assetMore:notifications')}
      />
      {total > 0 ? (
        <OverviewCarousel data={portfolioMetrics} onMetricsClicked={onMetricsClicked} carouselTitle="  " isVisible />
      ) : null}
    </View>
  );
};

interface IPropertyOverviewStyle {
  container: ViewStyle;
  upArrow: ViewStyle;
  valueContainer: ViewStyle;
  valueChange: ViewStyle;
  valueChangeTime: ViewStyle;
}

const propertyOverviewStyle = (isMobile?: boolean): StyleSheet.NamedStyles<IPropertyOverviewStyle> =>
  StyleSheet.create<IPropertyOverviewStyle>({
    container: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      borderRadius: 4,
      backgroundColor: theme.colors.white,
      marginBottom: 36,
    },
    upArrow: {
      transform: [{ rotate: '-90deg' }],
    },
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    valueChange: {
      color: theme.colors.lightGreen,
      marginRight: 8,
    },
    valueChangeTime: {
      color: theme.colors.darkTint6,
    },
  });

export default NotificationHeader;
