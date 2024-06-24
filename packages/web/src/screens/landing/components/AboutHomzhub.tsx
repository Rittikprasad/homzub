import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import StoreButton from '@homzhub/web/src/components/molecules/MobileStoreButton';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const AboutHomzhub: FC = () => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const notDesktop = useDown(deviceBreakpoint.TABLET);
  return (
    <View style={styles.container}>
      <View style={[styles.subContainer, notDesktop && styles.subContainerMobile]}>
        <Typography variant="text" size="regular" fontWeight="semiBold" style={styles.title}>
          {t('aboutHomzhub')}
        </Typography>
        <Text style={[styles.text, notDesktop && styles.mobileText]} type="small">
          {t('aboutDescription')}
        </Text>
        <View style={[styles.buttonContainer, notDesktop && styles.tabContainer, isMobile && styles.mobileContainer]}>
          <StoreButton
            store="apple"
            containerStyle={[styles.button, isMobile && styles.mobileButton]}
            imageIconStyle={styles.imageIconStyle}
            mobileImageIconStyle={styles.mobileImageIconStyle}
          />

          <StoreButton
            store="google"
            containerStyle={[styles.googleButton, isMobile && styles.googleMobileIcon]}
            imageIconStyle={styles.imageIconStyle}
            mobileImageIconStyle={styles.mobileImageIconStyle}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: theme.colors.white,
  },
  subContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: theme.layout.dashboardWidth,
  },

  subContainerMobile: {
    width: theme.layout.dashboardMobileWidth,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  title: {
    color: theme.colors.darkTint4,
    width: 'auto',
  },
  text: {
    width: '58%',
    marginTop: 16,
    color: theme.colors.darkTint4,
    textAlign: 'justify',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  mobileText: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
  mobileButton: {
    marginLeft: '10%',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '22%',
  },
  googleButton: {
    width: '100%',
    maxWidth: '100%',
    marginLeft: '12%',
  },
  mobileContainer: {
    textAlign: 'center',
    width: '100%',
  },
  imageIconStyle: {
    width: '100%',
    height: 90,
    resizeMode: 'stretch',
    maxWidth: '100%',
  },
  mobileImageIconStyle: {
    width: '106px',
  },
  tabContainer: {
    width: '40%',
  },
  googleMobileIcon: {
    marginLeft: 0,
    marginRight: '10%',
  },
});

export default AboutHomzhub;
