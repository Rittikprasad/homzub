import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { GradientBackground } from '@homzhub/web/src/screens/landing/components/GradientBackground';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

// todo replace dummy data
export const FAQBanner: FC = () => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.landing);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  return (
    <View style={styles.container}>
      <GradientBackground>
        <View style={styles.content}>
          <Typography size={isMobile ? 'small' : 'large'} variant="title" fontWeight="bold" style={styles.bannerText}>
            {t('common:faqBannerText')}
          </Typography>
        </View>
      </GradientBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
    width: '100%',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  bannerText: {
    color: theme.colors.white,
    textAlign: 'center',
  },
});
