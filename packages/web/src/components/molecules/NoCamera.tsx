import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import NoRecording from '@homzhub/common/src/assets/images/noRecording.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import StoreButton from '@homzhub/web/src/components/molecules/MobileStoreButton';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const NoCamera: React.FC = () => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const notDesktop = useDown(deviceBreakpoint.TABLET);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={[styles.content, isMobile && styles.mobileContent]}>
        <NoRecording />
        <Typography size="large" variant="text" fontWeight="semiBold" style={styles.heading}>
          {t('noWebCam')}
        </Typography>
        <Typography variant="text" size="small" fontWeight="regular" style={styles.title}>
          {t('noWebCamDescription')}
        </Typography>
        <View style={[styles.buttonContainer, notDesktop && styles.tabContainer, isMobile && styles.mobileContainer]}>
          <StoreButton
            store="appleLarge"
            containerStyle={styles.button}
            imageIconStyle={styles.imageIconStyle}
            mobileImageIconStyle={styles.appImageIconStyle}
          />
          <StoreButton
            store="googleLarge"
            containerStyle={styles.googleButton}
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
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 400,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    width: 555,
    top: 54,
    bottom: 77,
  },
  mobileContent: {
    width: '100%',
    top: 54,
    bottom: 77,
  },
  heading: {
    marginVertical: 24,
    marginHorizontal: 8,
    textAlign: 'center',
  },
  title: {
    marginHorizontal: 8,
    textAlign: 'center',
  },

  buttonContainer: {
    flexDirection: 'row',
    width: '60%',
    height: 36,
  },
  button: {
    width: '100%',
    maxWidth: '100%',
  },
  googleButton: {
    width: '100%',
    maxWidth: '100%',
    marginStart: 30,
  },

  mobileContainer: {
    width: '85%',
  },
  imageIconStyle: {
    width: '100%',
    height: 100,
    resizeMode: 'stretch',
    maxWidth: '100%',
  },
  mobileImageIconStyle: {
    width: '108px',
  },
  appImageIconStyle: {
    marginLeft: 'auto',
    width: '106px',
  },
  tabContainer: {
    width: '50%',
  },
});
export default NoCamera;
