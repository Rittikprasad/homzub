import React, { FC, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { CarouselProps } from 'react-multi-carousel';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { GraphQLRepository, IFeaturedProperties } from '@homzhub/common/src/domain/repositories/GraphQLRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import CarouselControlButtons from '@homzhub/web/src/components/molecules/CarouselControlButtons';
import PropertiesCarousel from '@homzhub/web/src/components/molecules/PropertiesCarousel';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const BannerAndProperties: FC = () => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const [featuredProperties, setFeaturedProperties] = useState<IFeaturedProperties[]>([]);
  const getFeaturedProperties = async (): Promise<void> => {
    const response = await GraphQLRepository.getFeaturedProperties();
    setFeaturedProperties(response);
  };
  useEffect(() => {
    getFeaturedProperties().then();
  }, []);

  const numberOfSlides = (): number => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const defaultResponsive = {
    desktop: {
      breakpoint: {
        max: 3840,
        min: 0,
      },
      items: numberOfSlides(),
      slidesToSlide: 1,
    },
  };

  const carouselProps: CarouselProps = {
    children: undefined,
    arrows: false,
    autoPlay: false,
    draggable: true,
    focusOnSelect: false,
    infinite: true,
    renderButtonGroupOutside: true,
    customButtonGroup: (
      <CarouselControlButtons
        containerStyle={styles.carouselControlButtons}
        iconColor={theme.colors.shadow}
        iconStyle={styles.carouselControlButtonsIcons}
        carouselData={featuredProperties}
      />
    ),
    responsive: defaultResponsive,
    showDots: false,
  };

  return (
    <View style={[styles.carouselContainer, (isMobile || isTablet) && styles.carouselContainerMobileAndTablet]}>
      <PropertiesCarousel featuredProperties={featuredProperties} carouselProps={carouselProps} />
    </View>
  );
};

export default BannerAndProperties;

const styles = StyleSheet.create({
  carouselContainer: {
    width: '80%',
    margin: 'auto',
    paddingVertical: 100,
  },
  carouselControlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carouselControlButtonsIcons: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 24,
    border: 'none',
    backgroundColor: theme.colors.transparent,
    marginVertical: 20,
    marginHorizontal: 18,
  },
  carouselContainerMobileAndTablet: {
    width: '90%',
  },
});
