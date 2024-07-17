import React, { useRef } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PopupActions } from 'reactjs-popup/dist/types';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import Popover from '@homzhub/web/src/components/atoms/Popover';

export interface IContinuePopupProps {
  title: string;
  subTitle: string;
  buttonSubText: string;
}
interface IProps {
  buttonTitle?: string;
  iconName?: string;
  iconColor?: string;
  isSvg: boolean;
  isOpen: boolean;
  onContinueRoute?: string | null;
  svgSource?: string;
}

type Props = IContinuePopupProps & IProps;

const ContinuePopup: React.FC<Props> = (props: Props) => {
  const history = useHistory();
  const {
    title,
    subTitle,
    buttonSubText,
    buttonTitle,
    iconName,
    iconColor,
    isSvg,
    isOpen,
    onContinueRoute,
    svgSource,
  } = props;
  const popupRef = useRef<PopupActions>(null);
  const { t } = useTranslation();

  const handlePopupClose = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };
  const handleContinue = (): void => {
    if (onContinueRoute) {
      NavigationService.navigate(history, { path: onContinueRoute });
    }
    handlePopupClose();
  };
  const renderPopupCard = (): React.ReactElement => {
    return (
      <View style={styles.popupCard}>
        <Button
          icon={icons.close}
          iconSize={20}
          iconColor={theme.colors.darkTint3}
          onPress={handleContinue}
          containerStyle={styles.cross}
          type="text"
        />
        <Typography variant="text" size="large" fontWeight="semiBold">
          {title}
        </Typography>
        <Typography variant="text" size="small" style={styles.cardSubTitle} fontWeight="regular">
          {subTitle}
        </Typography>
        {isSvg ? (
          <Image
            source={svgSource || require('@homzhub/common/src/assets/images/propertySearch.svg')}
            style={styles.colorSVG}
          />
        ) : (
          <Icon
            name={iconName || icons.circularCheckFilled}
            size={80}
            color={iconColor || theme.colors.green}
            style={styles.iconStyle}
          />
        )}
        <Typography variant="label" size="large" style={styles.buttonSubText} fontWeight="regular">
          {buttonSubText}
        </Typography>
        <Button
          type="primary"
          containerStyle={styles.continueButton}
          title={buttonTitle || t('continue')}
          onPress={handleContinue}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Popover
        forwardedRef={popupRef}
        content={renderPopupCard()}
        popupProps={{
          position: 'center center',
          open: isOpen,
          on: [],
          arrow: false,
          closeOnDocumentClick: false,
          children: undefined,
          modal: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupCard: {
    height: 340,
    width: 480,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSubTitle: { marginVertical: 10 },
  iconStyle: { marginVertical: 30 },
  buttonSubText: {
    color: theme.colors.darkTint5,
  },
  continueButton: {
    marginVertical: 15,
    width: '80%',
  },
  cross: {
    position: 'absolute',
    zIndex: 1000,
    minWidth: 20,
    minHeight: 20,
    right: 24,
    top: 24,
  },
  colorSVG: {
    height: 140,
    width: 140,
    marginTop: 8,
  },
});
export default ContinuePopup;
