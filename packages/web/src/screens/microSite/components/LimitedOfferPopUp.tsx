import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import Subscribed from '@homzhub/web/src/components/molecules/Subscribed';
import LimitedOfferForm from '@homzhub/web/src/screens/microSite/components/LimitedOfferForm';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IPopup {
  handlePopupClose: () => void;
}

const LimitedOfferPopUp = ({ handlePopupClose }: IPopup): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.microSite);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const [didSubscribe, setDidSubscribe] = useState(false);
  useEffect(() => {
    let subscribedTimer: NodeJS.Timeout;
    if (didSubscribe) {
      subscribedTimer = setTimeout(() => {
        handlePopupClose();
      }, 2000);
    }
    return (): void => {
      clearTimeout(subscribedTimer);
    };
  }, [didSubscribe]);

  const handleUserSubscription = (): void => {
    setDidSubscribe(true);
  };

  const bannerImage = {
    height: isMobile ? 136 : 180,
    width: '100%',
  };
  const navigateToNewScreen = (): void => {
    NavigationService.openNewTab({ path: 'https://rebrand.ly/homzhub-inspection-report' });
  };

  return (
    <>
      {didSubscribe ? (
        <Subscribed subText={t('limitedOfferThankYou')} handlePopupClose={handlePopupClose} />
      ) : (
        <View style={[styles.container, isMobile && styles.containerMobile]}>
          <Button
            icon={icons.close}
            iconSize={20}
            iconColor={!didSubscribe ? theme.colors.white : theme.colors.darkTint3}
            onPress={handlePopupClose}
            containerStyle={styles.cross}
            type="text"
          />
          <View style={styles.alignToCenter}>
            <Image source={require('@homzhub/common/src/assets/images/microSitePopupBanner.svg')} style={bannerImage} />
          </View>
          <View style={styles.alignToCenter}>
            <LimitedOfferForm onUserSubscription={handleUserSubscription} />
            <View style={styles.noteTextContainer}>
              <Typography variant="label" size="large" fontWeight="regular" style={styles.noteTextBody}>
                {t('limitedPopupSubText')}
              </Typography>
              <Typography
                variant="label"
                size="large"
                fontWeight="regular"
                style={styles.noteTextBody}
                onPress={navigateToNewScreen}
              >
                {t('viewInspectionReport')}
                <Typography
                  variant="label"
                  size="large"
                  fontWeight="regular"
                  style={styles.noteLinkText}
                  onPress={navigateToNewScreen}
                >
                  {t('limitedPopupSubTextLink')}
                </Typography>
              </Typography>

              {/* <Typography ---------//TODO-------health check
                  variant="label"
                  size="large"
                  fontWeight="regular"
                  style={[styles.noteLinkText,styles.headerText]}
                  onPress={navigateToHealthCheck}
                >
                  {t('What is property health check?')}
                </Typography> */}
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: '90vh',
    backgroundColor: theme.colors.white,
    width: 450,
    paddingBottom: '5%',
  },
  alignToCenter: {
    alignItems: 'center',
  },
  containerMobile: {
    width: '100%',
    maxHeight: '96vh',
  },
  image: {
    paddingHorizontal: 18,
  },
  headerText: {
    textAlign: 'center',
    marginTop: 12,
  },
  titleText: {
    textAlign: 'center',
    marginTop: 12,
    width: '80%',
  },
  cross: {
    position: 'absolute',
    zIndex: 1000,
    minWidth: 20,
    minHeight: 20,
    right: 16,
    top: 16,
  },
  noteTextContainer: {
    width: '90%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteTextBody: {
    color: theme.colors.darkTint2,
  },
  noteLinkText: {
    color: theme.colors.primaryColor,
    textDecorationLine: 'underline',
    textDecorationColor: theme.colors.primaryColor,
  },
});

export default LimitedOfferPopUp;
