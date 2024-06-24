import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

export interface IDataProps {
  value: string;
  id: number;
}

export const SignupCarousalCard = (props: IDataProps): React.ReactElement => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTab = useDown(deviceBreakpoint.TABLET);
  const { t } = useTranslation();
  const { value } = props;
  return (
    <View style={styles.card}>
      <View style={styles.imageStyle}>
        <Image
          source={{ uri: value }}
          style={[styles.image, isMobile && styles.mobileImage, isTab && !isMobile && styles.tabImage]}
        />
      </View>

      <View style={styles.textContainer}>
        <View style={styles.headerContainer}>
          <Text type="large" textType="semiBold" style={styles.header}>
            {t('signupCarouselTitle')}
          </Text>
        </View>
        <View style={styles.description}>
          <Text type="small" textType="regular" style={[styles.text, isTab && styles.textTab, isMobile && styles.text]}>
            {t('signupCarouselDescription')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 4,

    justifyContent: 'center',
    alignItems: 'stretch',
  },

  imageStyle: {
    alignItems: 'center',
  },
  image: {
    width: 470,
    height: 300,
    marginTop: 200,
    marginHorizontal: 146,
  },
  mobileImage: {
    width: 280,
    height: 186,
    marginTop: '150px',
    marginLeft: '20px',
    marginRight: '20px',
  },
  tabImage: {
    width: 372,
    height: 247,
    marginTop: '200px',
  },
  header: {
    textAlign: 'center',
    color: theme.colors.darkTint2,
    marginHorizontal: 20,
    flexWrap: 'wrap',
  },
  headerContainer: {
    marginTop: 24,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    textAlign: 'center',
    color: theme.colors.darkTint3,
    marginHorizontal: 19,
    marginBottom: 40,
  },
  textTab: {
    marginHorizontal: 55,
  },
  description: {
    marginTop: 16,
  },
});
