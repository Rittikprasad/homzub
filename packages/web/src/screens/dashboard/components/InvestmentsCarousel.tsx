import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import PropertiesCarousel from '@homzhub/web/src/components/molecules/PropertiesCarousel';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const InvestmentsCarousel = (): React.ReactElement => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  return (
    <View style={[styles.carouselContainer, isMobile && styles.containerMobile]}>
      <View style={styles.titleContainer}>
        <Icon name={icons.increase} color={theme.colors.dark} size={24} style={styles.icon} />
        <Text type="regular" textType="semiBold" style={styles.title}>
          Investments
        </Text>
      </View>
      <PropertiesCarousel />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    backgroundColor: theme.colors.background,
    marginVertical: 10,
    marginRight: -16,
  },
  containerMobile: {
    marginRight: undefined,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.dark,
  },
  icon: {
    margin: 12,
  },
});

export default InvestmentsCarousel;
