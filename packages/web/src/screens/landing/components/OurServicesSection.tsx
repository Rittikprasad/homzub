/* eslint-disable @typescript-eslint/prefer-regexp-exec */
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { useDown, useUp, useIsIpadPro } from '@homzhub/common/src/utils/MediaQueryUtils';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import StoreButton, { imageType } from '@homzhub/web/src/components/molecules/MobileStoreButton';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  scrollRef?: any;
}

const OurServicesSection: FC<IProps> = (props: IProps) => {
  const { scrollRef } = props;
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isDesktop = useUp(deviceBreakpoint.TABLET);
  const socialMediaLinks: imageType[] = ['instagram', 'twitter', 'youtube', 'linkedin', 'facebook'];

  return (
    <View style={styles.container} ref={scrollRef}>
      <View style={[styles.content, isMobile && styles.contentMobile]}>
        <View style={{ justifyContent: 'center' }}>
          <Typography
            variant="text"
            size="small"
            fontWeight="semiBold"
            style={[styles.text, isMobile && styles.textMobile]}
          >
            {t('common:footerSocialMediaText')}
          </Typography>
          <View style={[styles.socialMediaIcons, isDesktop && styles.socialMediaIconsDesktop]}>
            {socialMediaLinks.map((icon) => {
              return (
                <StoreButton
                  key={`social-media-icon-${icon}`}
                  store={icon}
                  containerStyle={styles.icons}
                  imageIconStyle={styles.imageIconStyle}
                  mobileImageIconStyle={styles.mobileImageIconStyle}
                />
              );
            })}
          </View>
        </View>
        <Newsletter />
      </View>
    </View>
  );
};

const Newsletter = (): React.ReactElement => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.DESKTOP);
  const isDesktop = useUp(deviceBreakpoint.TABLET);
  const isIpadPro = useIsIpadPro();

  const [didSubscribe, setDidSubscribe] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [email, setEmail] = useState('');
  useEffect(() => {
    let subscribedTimer: NodeJS.Timeout;
    if (didSubscribe) {
      subscribedTimer = setTimeout(() => {
        setDidSubscribe(false);
      }, 3000);
    }
    if (isEmailValid) {
      subscribedTimer = setTimeout(() => {
        setIsEmailValid(false);
      }, 3000);
    }
    return (): void => {
      clearTimeout(subscribedTimer);
    };
  }, [didSubscribe, isEmailValid]);

  const subscribeToNewsLetter = (): void => {
    if (email.match(FormUtils.emailRegex)) {
      CommonRepository.subscribeToNewsLetter({ email })
        .then(() => {
          setDidSubscribe(true);
          setEmail('');
        })
        .catch((error) => {
          const errorMessage = ErrorUtils.getErrorMessage(error.details);
          AlertHelper.error({ message: errorMessage, statusCode: error.details.statusCode });
        });
    } else {
      setIsEmailValid(true);
    }
  };
  return (
    <View
      style={[
        styles.newsletterContainer,
        isDesktop && styles.newsletterContainerDesktop,
        isMobile && styles.newsletterContainerMobile,
        isIpadPro && styles.newsletterContainerIpadPro,
        isTablet && styles.newsletterContainerTablet,
      ]}
    >
      <Typography variant="label" size="large" fontWeight="regular" style={styles.text}>
        {t('landing:subscribeEmailDesc')}
      </Typography>
      <View style={[styles.emailInputBox, isMobile && styles.emailInputBoxMobile]}>
        <TextInput
          placeholder={t('landing:enterEmail')}
          placeholderTextColor={theme.colors.darkTint10}
          style={[styles.emailInput, isMobile && styles.emailInputMobile]}
          value={email}
          onChangeText={setEmail}
        />
        <Button
          type="secondary"
          containerStyle={[
            styles.subscribeBtn,
            isMobile && styles.subscribeBtnMobile,
            didSubscribe && styles.subscribedBtn,
          ]}
          title={didSubscribe ? t('landing:subscribed') : t('landing:subscribe')}
          textType="label"
          textSize="large"
          fontType="regular"
          titleStyle={[styles.subscribeBtnTxt, didSubscribe && styles.subscribedBtnText]}
          onPress={subscribeToNewsLetter}
        >
          {didSubscribe && (
            <Icon name={icons.circularCheckFilled} color={theme.colors.green} size={18} style={styles.icon} />
          )}
        </Button>
      </View>
      <Typography variant="label" size="large" fontWeight="regular" style={styles.text}>
        {isEmailValid ? t('landing:emailValidations') : ' '}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 243,
    backgroundColor: theme.colors.blue,
  },
  content: {
    width: theme.layout.dashboardWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentMobile: {
    width: theme.layout.dashboardMobileWidth,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  emailInput: {
    color: theme.colors.white,
    padding: 12,
    maxWidth: '70%',
  },
  emailInputMobile: {
    width: '100%',
  },
  emailInputBox: {
    borderRadius: 4,
    marginTop: 12,
    width: 'fit-content',
    flexDirection: 'row',
    backgroundColor: theme.colors.darkGrayishBlue,
    flex: 1,
    marginBottom: 6,
  },
  emailInputBoxMobile: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 30,
  },
  subscribeBtnTxt: {
    marginVertical: 6,
    marginHorizontal: 16,
  },
  subscribeBtnMobile: {
    margin: 4,
  },
  subscribedBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  subscribedBtnText: {
    color: theme.colors.green,
    marginRight: 16,
    marginLeft: 0,
  },
  subscribeBtn: {
    margin: 6,
  },
  newsletterContainer: {
    minWidth: 380,
    alignItems: 'flex-start',
  },
  newsletterContainerDesktop: {
    marginLeft: '53%',
  },
  newsletterContainerTablet: {
    marginLeft: '14%',
  },
  newsletterContainerIpadPro: {
    marginLeft: '36%',
  },
  newsletterContainerMobile: {
    minWidth: undefined,
    marginTop: 36,
    alignItems: 'center',
    marginLeft: undefined,
  },
  icon: {
    justifyContent: 'center',
    marginRight: 12,
    marginLeft: 18,
  },
  socialMediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialMediaIconsDesktop: {
    marginLeft: '-5%',
  },
  icons: {
    width: 50,
    height: 50,
  },
  imageIconStyle: {
    width: 25,
    height: 25,
    resizeMode: 'stretch',
    maxWidth: '100%',
    marginVertical: 'auto',
  },
  mobileImageIconStyle: {
    width: '50%',
  },
});

export default OurServicesSection;
