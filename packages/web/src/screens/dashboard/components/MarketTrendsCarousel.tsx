import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import MarketTrendsCard from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCard';
import { MarketTrends } from '@homzhub/common/src/domain/models/MarketTrends';
import { IMarketTrendParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const MarketTrendsCarousel: FC = () => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const [marketTrends, setMarketTrends] = useState({} as MarketTrends);

  useEffect(() => {
    getMarketTrends((response) => setMarketTrends(response)).then();
  }, []);

  const total = marketTrends?.results?.length ?? 0;
  if (total <= 0) {
    return null;
  }
  const isVisible = false;
  return (
    <View style={[styles.carouselContainer, isMobile && styles.carouselContainerMobile]}>
      <View style={styles.titleContainer}>
        <Icon name={icons.increase} color={theme.colors.dark} size={24} style={styles.icon} />
        <Typography variant="text" size="regular" fontWeight="semiBold" style={styles.title}>
          Market Trends
        </Typography>
        {isVisible && (
          <TouchableWithoutFeedback>
            <Typography variant="text" size="small" fontWeight="regular" style={styles.viewAll}>
              View all
            </Typography>
          </TouchableWithoutFeedback>
        )}
      </View>
      <MultiCarousel>
        {marketTrends.results.map((trend) => (
          <MarketTrendsCard key={trend.id} data={trend} />
        ))}
      </MultiCarousel>
    </View>
  );
};

const getMarketTrends = async (callback: (response: MarketTrends) => void): Promise<void> => {
  const payload: IMarketTrendParams = {
    limit: 9,
    trend_type: undefined,
    q: undefined,
    offset: undefined,
  };
  try {
    const response = await CommonRepository.getMarketTrends(payload);
    callback(response);
  } catch (err) {
    // todo: handle error case
  }
};

const styles = StyleSheet.create({
  carouselContainer: {
    backgroundColor: theme.colors.background,
    marginVertical: 10,
    marginRight: -16,
  },
  carouselContainerMobile: {
    marginRight: undefined,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: theme.colors.dark,
  },
  viewAll: {
    color: theme.colors.primaryColor,
    margin: 16,
  },
  icon: {
    margin: 12,
  },
});

export default MarketTrendsCarousel;
