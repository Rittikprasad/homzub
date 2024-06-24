import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

export const FooterWithSocialMedia: FC = () => {
  const history = useHistory();
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const navigateToPrivacyPolicyScreen = (): void => {
    NavigationService.navigate(history, { path: RouteNames.publicRoutes.PRIVACY_POLICY });
  };
  const navigateToTermsAndConditionScreen = (): void => {
    NavigationService.navigate(history, { path: RouteNames.publicRoutes.TERMS_CONDITION });
  };
  return (
    <View style={[styles.footerContainer]}>
      <View style={[styles.contentMobile, !isMobile && styles.content]}>
        <View style={styles.copyrightTextContainer}>
          <Typography variant="label" size="regular" style={styles.copyrightText}>
            {t('copyrightContent')}
          </Typography>
          <Typography variant="label" size="regular" fontWeight="semiBold" style={styles.copyrightText}>
            {t('homzhubLink')}
          </Typography>
        </View>
        <View style={[styles.linksRow, isMobile && styles.linksRowMobile]}>
          <Button
            type="text"
            title={t('moreSettings:termsConditionsText')}
            textType="label"
            textSize="large"
            fontType="regular"
            titleStyle={[styles.text, isMobile && styles.textMobile]}
            onPress={navigateToTermsAndConditionScreen}
          />
          <Button
            type="text"
            containerStyle={styles.privacyPolicy}
            title={t('moreSettings:privacyPolicyText')}
            textType="label"
            textSize="large"
            fontType="regular"
            titleStyle={[styles.text, isMobile && styles.textMobile]}
            onPress={navigateToPrivacyPolicyScreen}
          />
        </View>
      </View>
    </View>
  );
};

export default FooterWithSocialMedia;

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: theme.colors.footerBlue,
    justifyContent: 'center',
    paddingVertical: 10,
    alignItems: 'center',
    height: 70,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: theme.layout.dashboardWidth,
  },
  contentMobile: {
    width: theme.layout.dashboardMobileWidth,
    alignContent: 'center',
    justifyContent: 'center',
  },
  copyrightTextContainer: {
    flexDirection: 'row',
  },
  copyrightText: {
    color: theme.colors.white,
  },
  privacyPolicy: {
    marginLeft: 36,
  },
  text: {
    textAlign: 'left',
    color: theme.colors.white,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  textMobile: {
    textAlign: 'center',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: undefined,
  },
  linksRowMobile: {
    justifyContent: 'center',
  },
});
