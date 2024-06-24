import React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { ImageSquare } from '@homzhub/common/src/components/atoms/Image';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Hoverable } from '@homzhub/web/src/components/hoc/Hoverable';
import { ITestimonialProps } from '@homzhub/web/src/screens/landing/components/Testimonials';

const TestimonialsMobile: React.FC<ITestimonialProps> = (props: ITestimonialProps) => {
  const { onLeftNavClick, onRightNavClick, data, testimonialIndex } = props;
  const { t } = useTranslation();
  const styles = testimonialMobileStyle();
  return (
    <View style={styles.container}>
      <Label type="large" style={styles.titleText}>
        {t('landing:testimonials')}
      </Label>
      <Text type="large" style={styles.subTitleText}>
        {t('landing:successStories')}
      </Text>
      <View style={styles.cardContainer}>
        <View style={styles.cardImageContainer}>
          <View>
            <ImageSquare
              size={50}
              source={{
                uri: data[testimonialIndex].image,
              }}
            />
          </View>
          <View style={styles.cardImageInfo}>
            <Text type="regular" textType="semiBold" style={styles.textName}>
              {data[testimonialIndex].name}
            </Text>
            <Text type="small">{data[testimonialIndex].designation}</Text>
          </View>
        </View>
        <View style={styles.cardInfoContainer}>
          <View>
            <Text type="small" textType="semiBold" style={styles.textReview}>
              {data[testimonialIndex].review}
            </Text>
            <Label type="regular" style={styles.textDescription}>
              {data[testimonialIndex].description}
            </Label>
          </View>
          <View style={styles.cardInfoIcons}>
            <View style={styles.navButtons}>
              <Hoverable>
                {(isHovered: boolean): React.ReactNode => (
                  <Icon
                    name={icons.longArrowLeft}
                    size={12}
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
                    size={12}
                    color={isHovered ? theme.colors.darkTint4 : theme.colors.darkTint8}
                    onPress={onRightNavClick}
                  />
                )}
              </Hoverable>
            </View>
            <View style={styles.quotesDown}>
              <Icon name={icons.quoteDown} size={20} color={theme.colors.green} />
              <Icon name={icons.quoteDown} size={20} color={theme.colors.blue} style={styles.quoteDownGreen} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
interface ITestimonialMobileStyle {
  container: ViewStyle;
  cardImageContainer: ViewStyle;
  cardInfoContainer: ViewStyle;
  textReview: TextStyle;
  textDescription: TextStyle;
  cardImageInfo: ViewStyle;
  textName: ViewStyle;
  cardContainer: ViewStyle;
  titleText: TextStyle;
  subTitleText: TextStyle;
  navButtons: ViewStyle;
  cardInfoIcons: ViewStyle;
  longArrowLeft: ViewStyle;
  quotesDown: ViewStyle;
  quoteDownGreen: ViewStyle;
}
const testimonialMobileStyle = (): StyleSheet.NamedStyles<ITestimonialMobileStyle> =>
  StyleSheet.create<ITestimonialMobileStyle>({
    container: {
      backgroundColor: theme.colors.grey5,
      alignItems: 'center',
    },
    cardContainer: {
      backgroundColor: theme.colors.white,
      width: theme.layout.dashboardMobileWidth,
      shadowColor: theme.colors.landingCardShadow,
      shadowOffset: { width: 0, height: 42 },
      shadowOpacity: 0.8,
      shadowRadius: 120,
      borderTopRightRadius: 36,
      marginBottom: 36,
    },
    cardImageContainer: {
      flexDirection: 'row',
      marginTop: 24,
      marginLeft: 20,
      marginBottom: 20,
    },
    cardInfoContainer: {
      marginLeft: 20,
    },
    cardImageInfo: {
      marginLeft: 12,
    },
    textName: {
      marginBottom: 4,
    },
    titleText: {
      color: theme.colors.lightGreen,
      marginBottom: 16,
      marginTop: 36,
    },
    subTitleText: {
      color: theme.colors.darkTint2,
      marginBottom: 36,
    },
    textReview: {
      marginBottom: 12,
    },
    textDescription: {
      marginBottom: 30,
    },
    cardInfoIcons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    navButtons: {
      flexDirection: 'row',
      marginBottom: 30,
    },
    quotesDown: {
      flexDirection: 'row',
      marginRight: 20,
    },
    longArrowLeft: {
      marginRight: 24,
    },
    quoteDownGreen: {
      marginLeft: 2.5,
    },
  });
export default TestimonialsMobile;
