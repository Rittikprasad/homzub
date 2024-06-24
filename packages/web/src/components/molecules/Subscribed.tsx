import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import ThankYou from '@homzhub/common/src/assets/images/subscribed.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  subText: string;
  handlePopupClose: () => void;
}

const Subscribed = (props: IProps): React.ReactElement<IProps> => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.landing);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const { subText, handlePopupClose } = props;
  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <Button icon={icons.close} iconSize={20} onPress={handlePopupClose} containerStyle={styles.cross} type="text" />
      <View style={styles.alignToCenter}>
        <ThankYou />
      </View>
      <View style={styles.alignToCenter}>
        <Typography variant="title" size="small" fontWeight="semiBold" style={styles.headerText}>
          {t('thankYouText')}
        </Typography>
        <Typography variant="text" size="small" fontWeight="regular" style={styles.titleText}>
          {subText}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 54,
    paddingVertical: 30,
    width: 'fit-content',
  },
  containerMobile: {
    paddingHorizontal: 8,
    paddingBottom: 36,
    maxWidth: '94vw',
  },
  alignToCenter: {
    alignItems: 'center',
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
    marginVertical: 24,
  },
  cross: {
    position: 'absolute',
    zIndex: 1000,
    minWidth: 20,
    minHeight: 20,
    right: 16,
    top: 16,
  },
});

export default Subscribed;
