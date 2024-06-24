import React from 'react';
import { StyleSheet, View, ViewStyle, ImageStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { useTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { ImageSquare } from '@homzhub/common/src/components/atoms/Image';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import Accordian from '@homzhub/web/src/components/molecules/Accordian';

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
const AccordianHeader: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const styles = askQuesFormStyle(isMobile);
  return (
    <View style={styles.accordianHeader}>
      <View style={styles.firstChild}>
        <Text type="small" textType="regular" style={styles.titleContent}>
          My property images are not reflecting on the frontend.
        </Text>
        <Icon style={styles.icon} name={icons.downArrow} size={20} color={theme.colors.darkTint3} />
      </View>
      <View style={styles.secondChild}>
        <View style={styles.childContainer}>
          <View>
            <Label type="small" textType="regular" style={styles.titleLabel}>
              {t('helpAndSupport:caseId')}
            </Label>
            <Label type="regular" textType="semiBold" style={styles.titleData}>
              HOMZ1234
            </Label>
          </View>
          <View style={styles.details}>
            <Label type="small" textType="regular" style={styles.titleLabel}>
              {t('helpAndSupport:date')}
            </Label>
            <Label type="regular" textType="semiBold" style={styles.titleData}>
              23/sept/2020
            </Label>
          </View>
        </View>
        <View style={styles.details}>
          <Label type="small" textType="regular" style={styles.titleData}>
            {t('helpAndSupport:status')}
          </Label>
          <Label type="regular" textType="semiBold" style={styles.titleData}>
            Approval PEnding
          </Label>
        </View>
      </View>
    </View>
  );
};

const CarouselProps = {
  children: undefined,
  arrows: false,
  autoPlay: false,
  draggable: true,
  focusOnSelect: false,
  infinite: true,
  renderDotsOutside: true,
  responsive: defaultResponsive,
  showDots: false,
};
const AccordianContent: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const styles = askQuesFormStyle(isMobile);
  return (
    <View style={styles.content}>
      <Label type="large" textType="regular" style={styles.contentLabel}>
        Ut enim sagittis dui lacus, in felis convallis pulvinar. Posuere integer eu sit mauris vitae in. Diam aliquam
        elit nullam in urna ornare cursus mattis luctus
      </Label>
      <MultiCarousel passedProps={CarouselProps}>
        <ImageSquare
          style={styles.image as ImageStyle}
          size={50}
          source={{
            uri: 'https://cdn57.androidauthority.net/wp-content/uploads/2020/04/oneplus-8-pro-ultra-wide-sample-twitter-1.jpg',
          }}
        />
        <ImageSquare
          style={styles.image as ImageStyle}
          size={50}
          source={{
            uri: 'https://cdn57.androidauthority.net/wp-content/uploads/2020/04/oneplus-8-pro-ultra-wide-sample-twitter-1.jpg',
          }}
        />
        <ImageSquare
          style={styles.image as ImageStyle}
          size={50}
          source={{
            uri: 'https://cdn57.androidauthority.net/wp-content/uploads/2020/04/oneplus-8-pro-ultra-wide-sample-twitter-1.jpg',
          }}
        />
      </MultiCarousel>
      <View style={styles.buttonWrapper}>
        <Button type="secondaryOutline" containerStyle={styles.buttonStyle}>
          <Icon name={icons.circularCheckFilled} color={theme.colors.blue} size={20} />
          <Typography variant="label" size="large" style={styles.buttonLabel}>
            Mark as close
          </Typography>
        </Button>
      </View>
      <TextArea
        inputContainerStyle={styles.textAreastyle}
        wordCountLimit={200}
        placeholder={t('common:typehere')}
        value=""
      />
      <View style={styles.buttonGroup}>
        <Button type="secondaryOutline" containerStyle={styles.buttonStyle1}>
          <Text type="small" textType="semiBold" style={styles.buttonLabel}>
            Cancle
          </Text>
        </Button>
        <Button type="primary" containerStyle={styles.buttonStyle1}>
          <Text type="small" textType="semiBold" style={styles.buttonLabel1}>
            Submit
          </Text>
        </Button>
      </View>
    </View>
  );
};

const LogsCards: React.FC = () => {
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const styles = askQuesFormStyle(isMobile);
  return (
    <View style={styles.accordianContainer}>
      <Accordian headerComponent={<AccordianHeader />} accordianContent={<AccordianContent />} />
    </View>
  );
};

interface IAskQuesFormStyle {
  titleContent: ViewStyle;
  contentLabel: ViewStyle;
  textAreastyle: ViewStyle;
  accordianContainer: ViewStyle;
  image: ImageStyle;
  accordianHeader: ViewStyle;
  firstChild: ViewStyle;
  secondChild: ViewStyle;
  childContainer: ViewStyle;
  details: ViewStyle;
  titleLabel: ViewStyle;
  titleData: ViewStyle;
  content: ViewStyle;
  icon: ImageStyle;
  buttonWrapper: ViewStyle;
  buttonStyle: ViewStyle;
  buttonGroup: ViewStyle;
  buttonLabel: ViewStyle;
  buttonLabel1: ViewStyle;
  buttonStyle1: ViewStyle;
}

const askQuesFormStyle = (isMobile: boolean): StyleSheet.NamedStyles<IAskQuesFormStyle> =>
  StyleSheet.create<IAskQuesFormStyle>({
    titleContent: {
      color: theme.colors.darkTint2,
    },
    contentLabel: {
      color: theme.colors.darkTint4,
      margin: 16,
    },
    textAreastyle: {
      height: 100,
    },
    accordianContainer: {
      backgroundColor: theme.colors.white,
      borderRadius: 4,
      margin: 10,
      borderColor: theme.colors.darkTint10,
      borderWidth: 1,
    },
    image: {
      flex: 1,
      minWidth: '100%',
      minHeight: 300,
      alignSelf: 'flex-start',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      margin: 12,
    },
    accordianHeader: {
      margin: 8,
      marginLeft: 16,
    },
    firstChild: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    secondChild: {
      flexDirection: 'row',
      marginTop: 16,
    },
    childContainer: {
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
    },
    details: { marginLeft: isMobile ? 0 : 30 },
    titleLabel: {
      color: theme.colors.darkTint3,
    },
    titleData: {
      color: theme.colors.darkTint3,
    },
    content: {
      margin: 10,
      marginTop: -10,
    },
    icon: {
      marginLeft: 10,
    },
    buttonWrapper: {
      alignItems: 'flex-end',
    },
    buttonStyle: {
      flexDirection: 'row',
      borderColor: theme.colors.disabled,
      maxWidth: 'max-content',
      height: 'max-content',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 4,
      borderRadius: 4,
      margin: 10,
    },
    buttonGroup: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
    },
    buttonLabel: {
      color: theme.colors.blue,
      margin: 4,
    },
    buttonLabel1: {
      color: theme.colors.white,
      margin: 4,
    },
    buttonStyle1: {
      flexDirection: 'row',
      borderColor: theme.colors.disabled,
      maxWidth: 'max-content',
      height: 'max-content',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 24,
      borderRadius: 4,
      margin: 10,
    },
  });

export default LogsCards;
