import React, { FC, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useTranslation } from 'react-i18next';
import { useDown, useViewPort } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { GradientBackground } from '@homzhub/web/src/screens/landing/components/GradientBackground';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

// todo replace dummy data
export const LandingYoutubeSection: FC = () => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.landing);
  const popupRef = useRef<PopupActions>(null);
  const notDesktop = useDown(deviceBreakpoint.TABLET);
  return (
    <View style={styles.container}>
      <GradientBackground>
        <View style={styles.content}>
          <Typography variant={notDesktop ? 'text' : 'title'} size="large" fontWeight="semiBold" style={styles.heading}>
            {t('findNextProperty')}
          </Typography>
          <Typography variant="text" size="small" style={[styles.title, notDesktop && styles.titleMobile]}>
            {t('youtubeDescription')}
          </Typography>
          <Popover
            forwardedRef={popupRef}
            content={<HomzhubIntroVideo />}
            popupProps={{
              closeOnDocumentClick: true,
              children: undefined,
              modal: true,
            }}
          >
            <Button type="secondary" containerStyle={styles.playBtn}>
              <Icon name={icons.play} size={20} color={theme.colors.primaryColor} />
              <Typography variant="text" size="small" style={styles.playBtnTxt}>
                {t('watchVideo')}
              </Typography>
            </Button>
          </Popover>
        </View>
      </GradientBackground>
    </View>
  );
};

const HomzhubIntroVideo = (): React.ReactElement => {
  const youtubeSize = useViewPort().width;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();
  const scaleX = isMobile ? 0.8 : 0.5;
  const scaleY = isMobile ? 0.5 : 0.3;
  const videoStyle = {
    width: youtubeSize * scaleX,
    height: youtubeSize * scaleY,
  };
  return (
    <View>
      <iframe
        title={t('introToHomzhub')}
        style={videoStyle}
        src="https://www.youtube.com/embed/JE4I4I78Gl4"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 372,
    width: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: theme.colors.white,
    marginBottom: 24,
    marginHorizontal: 8,
    textAlign: 'center',
  },
  title: {
    color: theme.colors.white,
    marginBottom: 24,
    marginHorizontal: 8,
    textAlign: 'center',
    width: '50%',
  },
  titleMobile: {
    width: '95%',
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderWidth: 0,
  },
  playBtnTxt: {
    color: theme.colors.primaryColor,
    marginLeft: 8,
  },
});
