import React from 'react';
import { View, ViewStyle, StyleSheet, TextStyle, ImageStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { ImageSquare } from '@homzhub/common/src/components/atoms/Image';
import { Hoverable } from '@homzhub/web/src/components/hoc/Hoverable';
import { ITestimonialProps } from '@homzhub/web/src/screens/landing/components/Testimonials';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const TestimonialsDesktop: React.FC<ITestimonialProps> = (props: ITestimonialProps) => {
  const { onLeftNavClick, onRightNavClick, data, testimonialIndex } = props;
  const { t } = useTranslation();
  const styles = testimonialStyle();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const onlyTablet = useOnly(deviceBreakpoint.TABLET);
  return (
    <View style={styles.container}>
      <Typography
        variant={!isMobile ? 'text' : 'label'}
        size={!isMobile ? 'small' : 'large'}
        fontWeight="semiBold"
        style={styles.titleText}
      >
        {t('landing:testimonials')}
      </Typography>
      <Typography
        variant={isMobile ? 'text' : 'title'}
        size={onlyTablet ? 'regular' : 'large'}
        fontWeight="semiBold"
        style={styles.subTitleText}
      >
        {t('landing:successStories')}
      </Typography>
      <View style={styles.cardContainer}>
        <View style={styles.cardImage}>
          <View style={styles.cardImageContainer}>
            <View style={styles.imageSquare}>
              <ImageSquare
                style={styles.image as ImageStyle}
                size={215}
                source={{
                  uri: data[testimonialIndex].image,
                }}
              />
            </View>
            <View style={styles.quotesUp}>
              <Icon name={icons.quoteUp} size={50} color={theme.colors.blue} style={styles.quoteUpBlue} />
              <Icon name={icons.quoteUp} size={50} color={theme.colors.green} />
            </View>
          </View>
          <View style={styles.cardImageInfo}>
            <Text type="regular" textType="semiBold" style={styles.textName}>
              {data[testimonialIndex].name}
            </Text>
            <Text type="small" style={styles.textDesignation}>
              {data[testimonialIndex].designation}
            </Text>
          </View>
        </View>
        <View style={styles.cardInfoContainer}>
          <View style={styles.cardInfo}>
            <Text textType="semiBold" style={styles.textReview}>
              {data[testimonialIndex].review}
            </Text>
            <Text style={styles.textDescription}> {data[testimonialIndex].description} </Text>
          </View>
          <View style={styles.cardInfoIcons}>
            <View style={styles.navButtons}>
              <Hoverable>
                {(isHovered: boolean): React.ReactNode => (
                  <Icon
                    name={icons.longArrowLeft}
                    size={20}
                    color={isHovered ? theme.colors.darkTint4 : theme.colors.darkTint8}
                    style={styles.longArrowLeft}
                    onPress={onLeftNavClick}
                  />
                )}
              </Hoverable>
              <Hoverable>
                {(isHovered: boolean): React.ReactNode => (
                  <Icon
                    name={icons.longArrowRight}
                    size={20}
                    color={isHovered ? theme.colors.darkTint4 : theme.colors.darkTint8}
                    onPress={onRightNavClick}
                  />
                )}
              </Hoverable>
            </View>
            <View style={styles.quotesDown}>
              <Icon name={icons.quoteDown} size={50} color={theme.colors.green} />
              <Icon name={icons.quoteDown} size={50} color={theme.colors.blue} style={styles.quoteDownGreen} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
interface ITestimonialStyle {
  container: ViewStyle;
  titleText: TextStyle;
  subTitleText: TextStyle;
  cardContainer: ViewStyle;
  cardImage: ViewStyle;
  cardInfoContainer: ViewStyle;
  cardInfo: ViewStyle;
  cardImageContainer: ViewStyle;
  imageSquare: ViewStyle;
  quotesUp: ViewStyle;
  quotesDown: ViewStyle;
  textReview: TextStyle;
  textDescription: TextStyle;
  navButtons: ViewStyle;
  cardInfoIcons: ViewStyle;
  cardImageInfo: ViewStyle;
  textName: ViewStyle;
  textDesignation: ViewStyle;
  quoteUpBlue: ViewStyle;
  quoteDownGreen: ViewStyle;
  longArrowLeft: ViewStyle;
  image: ImageStyle;
}

const testimonialStyle = (): StyleSheet.NamedStyles<ITestimonialStyle> =>
  StyleSheet.create<ITestimonialStyle>({
    container: {
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      backgroundColor: theme.colors.white,
    },
    titleText: {
      color: theme.colors.lightGreen,
      marginBottom: 24,
      marginTop: 120,
    },
    subTitleText: {
      color: theme.colors.darkTint2,
    },
    cardContainer: {
      marginTop: 60,
      marginBottom: 120,
    },
    cardImage: {
      flexDirection: 'column',
      position: 'absolute',
      zIndex: 1,
      width: '25w',
      shadowColor: theme.colors.landingCardShadow,
      shadowOffset: { width: 0, height: 42 },
      shadowOpacity: 0.8,
      shadowRadius: 120,
      backgroundColor: theme.colors.white,
    },
    cardImageContainer: {
      flexDirection: 'row',
    },
    imageSquare: {
      marginLeft: 42,
      marginTop: 42,
    },
    cardImageInfo: {
      marginTop: 24,
      marginLeft: 42,
      marginBottom: 42,
    },
    textName: {
      marginBottom: 8,
    },
    textDesignation: {},
    quotesUp: {
      flexDirection: 'row',
      marginTop: 42,
      marginLeft: 26,
      marginRight: 42,
    },
    quotesDown: {
      flexDirection: 'row',
    },
    navButtons: {
      flexDirection: 'row',
    },
    cardInfoContainer: {
      position: 'relative',
      marginTop: 90,
      marginLeft: 180,
      width: '70vw',
      borderTopRightRadius: 50,
      shadowColor: theme.colors.landingCardShadow,
      shadowOffset: { width: 0, height: 42 },
      shadowOpacity: 0.8,
      shadowRadius: 120,
    },
    cardInfo: {
      marginLeft: 230,
      marginRight: 25,
    },
    textReview: {
      marginTop: 30,
      marginBottom: 24,
      fontSize: 24,
    },
    textDescription: {
      fontSize: 16,
      marginBottom: 60,
      minHeight: 120,
    },
    cardInfoIcons: {
      marginLeft: 230,

      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
      marginRight: 42,
    },
    quoteUpBlue: {
      marginRight: 2.5,
    },
    longArrowLeft: {
      marginRight: 36,
    },
    quoteDownGreen: {
      marginLeft: 2.5,
    },
    image: {
      borderTopRightRadius: 50,
    },
  });
export default TestimonialsDesktop;
