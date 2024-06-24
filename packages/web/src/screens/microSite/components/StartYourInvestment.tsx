import React, { FC, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown, useUp, useViewPort, useIsIpadPro } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const StartYourInvestment: FC = () => {
  const [bannerMobileHeight, setBannerMobileHeight] = useState(0);
  const { t } = useTranslation();
  const isDesktop = useUp(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isIpadPro = useIsIpadPro();
  const { width } = useViewPort();
  const bannerStyles = {
    width: !isTablet && !isIpadPro && !isMobile ? width - 15 : width,
    height: !isMobile ? 200 : bannerMobileHeight,
  };

  const upperImageStyles = {
    width: isTablet ? 210 : 230,
    height: isTablet ? 210 : 240,
  };

  const onLayout = (e: LayoutChangeEvent): void => {
    const { height } = e.nativeEvent.layout;
    setBannerMobileHeight(height);
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <View
        style={[
          styles.banner,
          isDesktop && styles.upperImage,
          isTablet && styles.upperImageTablet,
          isMobile && styles.upperImageMobile,
        ]}
      >
        <Image source={require('@homzhub/common/src/assets/images/family.png')} style={upperImageStyles} />
      </View>

      <View style={[styles.banner, styles.lowerImage]}>
        <Image
          source={
            !isMobile
              ? require('@homzhub/common/src/assets/images/propertiesBanner.jpg')
              : require('@homzhub/common/src/assets/images/propertiesBannerMobile.jpg')
          }
          style={bannerStyles}
        />
      </View>

      <View style={[isTablet && styles.contentTablet, isMobile ? styles.contentMobile : styles.content]}>
        <Typography variant="title" size="large" fontWeight="semiBold" style={[styles.centerText, styles.headerText]}>
          {t('landing:startYourInvestment')}
        </Typography>
        <Typography variant="text" size="small" style={[styles.centerText, styles.subHeaderText]}>
          {t('landing:startInvestmentSubText')}
        </Typography>
        <Typography variant="text" size="small" style={[styles.centerText, styles.subHeaderText]}>
          {t('landing:startInvestmentSubTextAuthor')}
        </Typography>
      </View>
    </View>
  );
};

export default StartYourInvestment;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
    marginTop: 16,
  },
  headerText: {
    color: theme.colors.darkTint1,
  },
  subHeaderText: {
    color: theme.colors.darkTint2,
  },
  banner: {
    position: 'absolute',
  },
  lowerImage: {
    zIndex: -1,
  },
  upperImage: {
    left: '10%',
    top: -40,
  },
  upperImageMobile: {
    left: '25%',
    top: 15,
  },
  upperImageTablet: {
    top: -10,
  },
  content: {
    paddingVertical: 40,
  },
  contentTablet: {
    marginLeft: '40%',
  },
  contentMobile: {
    paddingTop: 280,
    paddingBottom: 30,
    marginLeft: undefined,
  },
});
