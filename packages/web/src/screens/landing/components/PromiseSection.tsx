import React, { FC } from 'react';
import { StyleSheet, View, ImageStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown, useOnly, useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Family from '@homzhub/common/src/assets/images/familyPana.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const PromiseSection: FC = () => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const onlyTablet = useOnly(deviceBreakpoint.TABLET);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Typography
            variant={!isMobile ? 'text' : 'label'}
            size={!isMobile ? 'small' : 'large'}
            fontWeight="semiBold"
            style={styles.title}
          >
            {t('values')}
          </Typography>
        </View>
        <View>
          <Typography
            variant={isMobile ? 'text' : 'title'}
            size={onlyTablet ? 'regular' : 'large'}
            fontWeight="semiBold"
            style={styles.header}
          >
            {t('ourPromise')}
          </Typography>
        </View>
      </View>
      <View style={[styles.valuesContainer, isMobile && styles.mobileContainer, isTablet && styles.mobileContainer]}>
        <View style={styles.imageContainer}>
          <Family style={imageStyles()} />
        </View>
        <View style={styles.text}>
          <Typography
            size="small"
            fontWeight="semiBold"
            style={[styles.contentHeader, !isLaptop && styles.mobileHeader]}
          >
            {t('integrity')}
          </Typography>
          <Typography
            variant="text"
            size="small"
            style={[styles.para, isTablet && styles.tabletPara, isMobile && styles.para]}
          >
            {t('integrityDescription')}
          </Typography>

          <Typography
            size="small"
            fontWeight="semiBold"
            style={[styles.contentHeader, !isLaptop && styles.mobileHeader]}
          >
            {t('trust')}
          </Typography>
          <Typography
            variant="text"
            size="small"
            style={[styles.para, isTablet && styles.tabletPara, isMobile && styles.para]}
          >
            {t('trustDescription')}
          </Typography>
          <Typography
            size="small"
            fontWeight="semiBold"
            style={[styles.contentHeader, !isLaptop && styles.mobileHeader]}
          >
            {t('transparency')}
          </Typography>
          <Typography
            variant="text"
            size="small"
            style={[styles.para, isTablet && styles.tabletPara, isMobile && styles.para]}
          >
            {t('transparencyDescription')}
          </Typography>
        </View>
      </View>
    </View>
  );
};
// FIXME (Ashwin) use from stylesheet instead
const imageStyles = (): ImageStyle => {
  return {
    maxWidth: '100%',
    height: '100%',
  };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: theme.colors.backgroundOpacity,
  },
  mobileContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginHorizontal: 0,
  },
  content: {
    alignItems: 'center',
  },
  header: {
    marginTop: 21,
    color: theme.colors.darkTint2,
  },
  title: {
    color: theme.colors.lightGreen,
    marginTop: 100,
  },
  image: {
    maxWidth: '100%',
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 65,
    marginVertical: 20,
  },
  imageContainer: {
    flexWrap: 'wrap',
  },
  text: {
    justifyContent: 'center',
    alignContent: 'center',
    flexShrink: 2,
    marginTop: 40,
  },
  para: {
    marginBottom: 42,
    color: theme.colors.darkTint5,
    alignContent: 'center',
    marginHorizontal: '15px',
  },

  contentHeader: {
    fontWeight: '500',
    marginBottom: 12,
    color: theme.colors.dark,
    marginHorizontal: 15,
  },
  mobileHeader: {
    textAlign: 'center',
  },
  tabletPara: {
    marginHorizontal: 140,
    textAlign: 'center',
  },
});

export default PromiseSection;
