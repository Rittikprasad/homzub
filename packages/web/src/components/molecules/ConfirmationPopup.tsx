import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

export interface IContinuePopupProps {
  title?: string;
  subTitle: string;
}
interface IProps {
  buttonTitle?: string;
  iconName?: string;
  iconColor?: string;
  isSvg?: string;
  updateData?: () => void;
  refreshPage?: () => void;
}

type Props = IContinuePopupProps & IProps;

const ConfirmationPopup: React.FC<Props> = (props: Props) => {
  const { title, subTitle, buttonTitle, refreshPage } = props;
  const popupRef = useRef<PopupActions>(null);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();

  useEffect(() => {
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  }, []);
  const handlePopupClose = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };

  const handlePress = (): void => {
    if (refreshPage) {
      refreshPage();
    }
    handlePopupClose();
  };
  const renderPopupCard = (): React.ReactElement => {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint3}
            onPress={handlePopupClose}
          />
        </View>
        <View style={styles.textContainer}>
          <Typography size="regular" fontWeight="semiBold">
            {title || t('common:congratulations')}
          </Typography>
          <Typography size="small" fontWeight="regular" style={styles.text}>
            {subTitle}
          </Typography>

          <Image source={require('@homzhub/common/src/assets/images/confirmCheck.svg')} style={styles.image} />
          <Button
            title={buttonTitle || t('common:done')}
            type="primary"
            containerStyle={styles.button}
            onPress={handlePress}
          />
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Popover
        forwardedRef={popupRef}
        content={renderPopupCard}
        popupProps={{
          position: 'center center',
          on: [],
          arrow: false,
          closeOnDocumentClick: false,
          children: undefined,
          modal: true,
          contentStyle: {
            width: !isMobile ? 480 : '95%',
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 42,
  },
  text: {
    paddingTop: 12,
    paddingBottom: 24,
    textAlign: 'center',
  },
  container: {
    marginHorizontal: '5%',
    marginVertical: 30,
    height: 372,
  },
  header: {
    flexDirection: 'row-reverse',
  },
  button: {
    width: '100%',
    height: 44,
    top: 60,
  },
  image: {
    height: 120,
    width: 120,
  },
});
export default ConfirmationPopup;
