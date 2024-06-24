import React, { FC, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CarouselProps } from 'react-multi-carousel';
import { useDown, useViewPort, useIsIpadPro } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import CarouselControlButtons from '@homzhub/web/src/components/molecules/CarouselControlButtons';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import StoreButton from '@homzhub/web/src/components/molecules/MobileStoreButton';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  scrollRef?: any;
}

const Testimonials: FC<IProps> = (props: IProps) => {
  const { scrollRef } = props;
  const [backgroundImageHeight, setBackgroundImageHeight] = useState(0);
  const { t } = useTranslation();
  const youtubeSize = useViewPort().width;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isIpadPro = useIsIpadPro();
  const scaleX = isMobile ? 0.8 : 0.5;
  const scaleY = isMobile ? 0.5 : 0.3;
  const videoStyle = {
    width: youtubeSize * scaleX,
    height: youtubeSize * scaleY,
    borderRadius: 8,
  };

  const testimonialsVideos = [
    { title: '', url: 'https://youtube.com/embed/ANQoMDIlGj8?rel=0' },
    { title: '', url: 'https://youtube.com/embed/gW0KJimNb-w?rel=0' },
  ];
  const defaultResponsive = {
    desktop: {
      breakpoint: {
        max: 3840,
        min: 0,
      },
      items: 1,
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
        iconColor={theme.colors.white}
        iconStyle={styles.carouselControlButtonsIcons}
        carouselData={testimonialsVideos}
      />
    ),
    responsive: defaultResponsive,
    showDots: false,
  };
  const backgroundImageWidth: number = useViewPort().width;

  const onLayout = (e: LayoutChangeEvent): void => {
    const { height } = e.nativeEvent.layout;
    setBackgroundImageHeight(height);
  };

  const backgroundImageStyle = {
    width: !isTablet && !isMobile && !isIpadPro ? backgroundImageWidth - 15 : backgroundImageWidth,
    height: backgroundImageHeight,
  };

  return (
    <View style={styles.testimonialsContainer} onLayout={onLayout} ref={scrollRef}>
      <View style={styles.backgroundImage}>
        <Image
          source={require('@homzhub/common/src/assets/images/testimonialsBackground.webp')}
          style={backgroundImageStyle}
        />
      </View>
      <View style={styles.videosCarouselContainer}>
        <Typography
          variant={isMobile ? 'text' : 'title'}
          size="large"
          fontWeight="semiBold"
          style={[styles.centerText, styles.subHeaderText, styles.testimonialsSubHeading]}
        >
          {t('landing:successStories')}
        </Typography>
        <MultiCarousel passedProps={carouselProps}>
          {testimonialsVideos.map((video) => (
            <View key={video.title} style={[styles.testimonialsVideos, isMobile && styles.testimonialsVideosMobile]}>
              <iframe
                title={video.title}
                style={videoStyle}
                src={video.url}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </View>
          ))}
        </MultiCarousel>
      </View>
      <Typography
        variant="text"
        size="large"
        max-width
        fontWeight="semiBold"
        style={[styles.centerText, styles.headerText, styles.freeText]}
      >
        {t('landing:freeForYou')}
      </Typography>
      <Typography
        variant="text"
        size={isMobile ? 'regular' : 'small'}
        style={[styles.centerText, styles.subHeaderText, styles.storeLinksText]}
      >
        {t('landing:storeLinkDescription')}
      </Typography>

      <View style={styles.storeButtons}>
        <StoreButton
          store="appleLarge"
          containerStyle={styles.storeButton}
          imageIconStyle={[styles.storeIcons, isTablet && styles.storeIconsTablet]}
          mobileImageIconStyle={styles.storeIconsMobile}
        />
        <StoreButton
          store="googleLarge"
          containerStyle={styles.storeButton}
          imageIconStyle={[styles.storeIcons, isTablet && styles.storeIconsTablet]}
          mobileImageIconStyle={styles.storeIconsMobile}
        />
      </View>
    </View>
  );
};
export default Testimonials;
const styles = StyleSheet.create({
  testimonialsContainer: {
    alignItems: 'center',
    position: 'relative',
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
  storeButtons: {
    flexDirection: 'row',
    paddingBottom: 120,
  },
  storeButton: {
    width: '100%',
    paddingHorizontal: 15,
  },
  storeIcons: {
    width: 200,
    height: 60,
    marginVertical: 75,
  },
  storeIconsTablet: {
    width: 135,
    height: 40,
    marginVertical: 55,
  },
  storeIconsMobile: {
    width: 110,
    height: 35,
    marginTop: 25,
    marginBottom: 40,
  },
  carouselControlButtons: {
    flexDirection: 'row',
    margin: 'auto',
  },
  carouselControlButtonsIcons: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 24,
    border: 'none',
    backgroundColor: theme.colors.transparent,
    paddingHorizontal: 36,
  },
  videosCarouselContainer: {
    maxWidth: '100%',
  },
  testimonialsVideos: {
    maxWidth: '50%',
    margin: 'auto',
    paddingVertical: 20,
  },
  testimonialsVideosMobile: {
    maxWidth: '80%',
  },
  testimonialsHeader: {
    marginTop: 65,
  },
  testimonialsSubHeading: {
    paddingVertical: 10,
  },
  freeText: {
    paddingVertical: 8,
  },
  storeLinksText: {
    marginVertical: 8,
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    zIndex: -1,
  },
});
