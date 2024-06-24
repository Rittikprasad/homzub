import React, { FC } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import LogoWithName from '@homzhub/common/src/assets/images/appLogoWithName.svg';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  children: React.ReactElement | React.ReactNode;
  title: string;
  subTitle: string;
  containerStyle: StyleProp<ViewStyle>;
  hasBackButton?: boolean;
  backButtonPressed?: () => void;
  hasBackToLoginButton?: boolean;
  navigationPath?: string;
  isUnderlineDesc?: boolean;
  underlineDesc?: string;
  routePath?: string;
}

const UserValidationScreensTemplate: FC<IProps> = (props: IProps) => {
  const {
    children,
    title,
    subTitle,
    containerStyle,
    hasBackToLoginButton,
    hasBackButton,
    navigationPath,
    isUnderlineDesc,
    underlineDesc,
    routePath,
  } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  const history = useHistory();
  const isMobile = useDown(deviceBreakpoint.MOBILE);

  const backButtonNavigation = (): void => {
    const { backButtonPressed } = props;
    if (backButtonPressed) {
      backButtonPressed();
    }
    if (navigationPath) NavigationService.navigate(history, { path: navigationPath });
  };

  const navigateToScreen = (path: string = RouteNames.publicRoutes.LOGIN): void => {
    NavigationService.navigate(history, { path });
  };
  return (
    <View style={[styles.baseContainerStyle, containerStyle]}>
      <View style={styles.subContainer}>
        <View style={isMobile ? styles.userValidationCommonContentMobile : styles.userValidationCommonContent}>
          <View style={styles.logo}>
            <LogoWithName />
          </View>
          {hasBackButton && (
            <Button type="secondary" onPress={backButtonNavigation} containerStyle={styles.backButton}>
              <Icon name={icons.longArrowLeft} />
            </Button>
          )}
          <Typography variant="text" size="regular" fontWeight="semiBold">
            {title}
          </Typography>
          <Typography variant="label" size="large" style={styles.subTitle}>
            {subTitle}
          </Typography>
          {isUnderlineDesc && (
            <View>
              <View style={styles.underline} />
              <Typography variant="label" size="large" style={styles.underlineDesc}>
                {underlineDesc}
              </Typography>
            </View>
          )}
        </View>

        {children}
        {hasBackToLoginButton && (
          <Button
            type="secondary"
            title={t('auth:backToLogin')}
            containerStyle={styles.backToLoginButton}
            titleStyle={styles.backToLoginButtonText}
            onPress={(): void => navigateToScreen(routePath)}
          />
        )}
      </View>
      <View style={styles.footer}>
        <View style={[styles.linksRow]}>
          <Button
            type="text"
            title={t('moreSettings:termsConditionsText')}
            textType="label"
            textSize="large"
            fontType="regular"
            titleStyle={[styles.linkText]}
            onPress={(): void => navigateToScreen(RouteNames.publicRoutes.TERMS_CONDITION)}
          />
          <Button
            type="text"
            title={t('moreSettings:privacyPolicyText')}
            textType="label"
            textSize="large"
            fontType="regular"
            titleStyle={[styles.linkText]}
            onPress={(): void => navigateToScreen(RouteNames.publicRoutes.PRIVACY_POLICY)}
          />
        </View>
        <View style={styles.copyrightContainer}>
          <Typography variant="label" size="large" style={styles.copyrightText}>
            {t('copyrightContent')}
          </Typography>
        </View>
      </View>
    </View>
  );
};

export default UserValidationScreensTemplate;

const styles = StyleSheet.create({
  baseContainerStyle: {
    justifyContent: 'space-between',
  },
  subContainer: {
    width: '100%',
  },
  logo: {
    marginVertical: 50,
  },
  backButton: {
    marginBottom: 25,
    borderWidth: 0,
    width: 'fit-content',
  },
  userValidationCommonContent: {
    marginHorizontal: 'auto',
    width: '55%',
  },
  userValidationCommonContentMobile: {
    marginHorizontal: 'auto',
    width: '90%',
  },
  backToLoginButton: {
    borderWidth: 0,
    width: 'fit-content',
    marginTop: 30,
    marginHorizontal: 'auto',
  },
  backToLoginButtonText: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  subTitle: {
    marginBottom: '2%',
  },
  underline: {
    height: '1px',
    backgroundColor: theme.colors.darkTint9,
  },
  underlineDesc: {
    marginTop: '3%',
  },
  footer: {
    alignSelf: 'center',
    marginBottom: 54,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    color: theme.colors.blue,
  },
  copyrightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyrightText: {
    color: theme.colors.darkTint4,
  },
});
