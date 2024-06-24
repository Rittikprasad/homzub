import React, { useEffect, useState, FC } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { LinkingService, URLs } from '@homzhub/web/src/services/LinkingService';
import { PixelEventType, PixelService } from '@homzhub/web/src/services/PixelService';
import { GraphQLRepository, IFeaturedProperties } from '@homzhub/common/src/domain/repositories/GraphQLRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import PropertiesCarousel from '@homzhub/web/src/components/molecules/PropertiesCarousel';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import '@homzhub/web/src/screens/landing/components/FeaturedProperties/FeaturedProperties.scss';

interface IProps {
  scrollRef?: any;
}
const FeaturedProperties: FC<IProps> = (props: IProps) => {
  const { scrollRef } = props;
  const { t } = useTranslation();
  const [featuredProperties, setFeaturedProperties] = useState<IFeaturedProperties[]>([]);
  const getFeaturedProperties = async (): Promise<void> => {
    const response = await GraphQLRepository.getFeaturedProperties();
    setFeaturedProperties(response);
  };
  const styles = featuredPropertiesStyle();
  useEffect(() => {
    getFeaturedProperties().then();
  }, []);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const onlyTablet = useOnly(deviceBreakpoint.TABLET);
  const navigateToScreen = (): void => {
    PixelService.ReactPixel.track(PixelEventType.ViewContent);
    LinkingService.redirect(URLs.featuredPropertiesSearch);
  };
  return (
    <View style={styles.container} ref={scrollRef}>
      <Typography
        variant={!isMobile ? 'text' : 'label'}
        size={!isMobile ? 'small' : 'large'}
        fontWeight="semiBold"
        style={styles.titleText}
      >
        {t('landing:recent')}
      </Typography>
      <Typography
        variant={isMobile ? 'text' : 'title'}
        size={onlyTablet ? 'regular' : 'large'}
        fontWeight="semiBold"
        style={styles.subTitleText}
      >
        {t('landing:featuredTitle')}
      </Typography>
      <View style={styles.carouselContainer}>
        <PropertiesCarousel featuredProperties={featuredProperties} />
      </View>
      <View style={styles.viewAllButton}>
        <Button
          type="primary"
          textType="label"
          textSize="large"
          title={t('landing:viewAllTitle')}
          onPress={navigateToScreen}
        />
      </View>
    </View>
  );
};

interface ITestimonialStyle {
  container: ViewStyle;
  titleText: TextStyle;
  subTitleText: TextStyle;
  carouselContainer: ViewStyle;
  viewAllButton: ViewStyle;
}

const featuredPropertiesStyle = (): StyleSheet.NamedStyles<ITestimonialStyle> =>
  StyleSheet.create<ITestimonialStyle>({
    container: {
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      backgroundColor: theme.colors.grey5,
    },
    titleText: {
      color: theme.colors.lightGreen,
      marginBottom: 24,
      marginTop: 120,
    },
    subTitleText: {
      color: theme.colors.darkTint2,
      marginBottom: 70,
    },
    carouselContainer: {
      flexDirection: 'column',
      width: theme.layout.dashboardWidth,
      marginBottom: 30,
    },
    viewAllButton: {
      marginBottom: 90,
    },
  });

export default FeaturedProperties;
