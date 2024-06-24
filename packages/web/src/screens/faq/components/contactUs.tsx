import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const ContactUs: React.FC = () => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <Typography variant="title" size="small" fontWeight="semiBold">
        {t('haveQuestion')}
      </Typography>
      <Typography
        variant="label"
        size="large"
        style={[
          styles.titleText,
          styles.topMargin,
          isTablet && styles.titleTextTab,
          isMobile && styles.titleTextMobile,
        ]}
      >
        {t('faqText')}
      </Typography>
      <View style={[styles.cardContainer, isTablet && styles.cardContainerTab, isMobile && styles.cardContainerMobile]}>
        <View style={[styles.callUs, isTablet && styles.callUsTab, isMobile && styles.callUsMobile]}>
          <Icon name={icons.call} size={32} color={theme.colors.darkTint7} />
          <Typography variant="label" size="large" style={[styles.phoneNumber, styles.topMargin]}>
            {t('+(91) - 8088900900')}
          </Typography>
          <Typography variant="label" size="large" style={styles.titleText}>
            {t('happyToHelp')}
          </Typography>
        </View>
        <View style={[styles.emailUs, isTablet && styles.callUsTab, isMobile && styles.callUsMobile]}>
          <Icon name={icons.mail} size={32} color={theme.colors.blue} />
          <Typography variant="label" size="large" style={[styles.emailAddress, styles.topMargin]}>
            {t('support@homzhub.com')}
          </Typography>
          <Typography variant="label" size="large" style={styles.titleText}>
            {t('answerFaster')}
          </Typography>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginVertical: 24,
  },
  containerMobile: {
    padding: 20,
  },
  titleText: {
    color: theme.colors.darkTint5,
    width: 550,
    textAlign: 'center',
  },
  titleTextTab: {
    width: 400,
  },
  titleTextMobile: {
    width: 310,
    marginTop: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    paddingHorizontal: 48,
    marginVertical: 56,
  },
  cardContainerTab: {
    paddingLeft: 21,
  },
  cardContainerMobile: {
    flexDirection: 'column',
    marginLeft: 24,
  },
  topMargin: {
    marginTop: 16,
  },
  topMarginCards: {
    marginTop: 32,
  },
  callUs: {
    padding: 44,
    width: 445,
    border: `1px solid ${theme.colors.darkTint10}`,
    marginRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callUsTab: {
    width: 300,
    padding: 24,
  },
  callUsMobile: {
    padding: 24,
    width: 340,
    marginBottom: 32,
  },
  emailUs: {
    backgroundColor: theme.colors.background,
    padding: 44,
    width: 445,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneNumber: {
    color: theme.colors.darkTint2,
  },
  emailAddress: {
    color: theme.colors.blue,
  },
});
export default ContactUs;
