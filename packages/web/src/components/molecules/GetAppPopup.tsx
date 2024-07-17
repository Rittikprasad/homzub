import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import StoreButton from '@homzhub/web/src/components/molecules/MobileStoreButton';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import GetPopupImage from '@homzhub/common/src/assets/images/GetApplication.svg';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  popupRef: React.MutableRefObject<PopupActions | null>;
  onCloseModal: () => void;
  onOpenModal: () => void;
}

const GetAppPopup: React.FC<IProps> = (props: IProps) => {
  const { onCloseModal, popupRef } = props;
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();

  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography variant="text" size="small" fontWeight="bold">
            {t('common:getAppPopupTitle')}
          </Typography>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint7}
            onPress={onCloseModal}
            containerStyle={styles.closeButton}
          />
        </View>
        <Divider containerStyles={styles.verticalStyle} />
        <View style={styles.modalContent}>
          <GetPopupImage height={80} width={78} />
          <Typography variant="text" size="small" fontWeight="bold" style={styles.getAppPopupContentTitle}>
            {t('common:getAppPopupContentTitle')}
          </Typography>
          <Typography variant="text" size="small" fontWeight="regular" style={styles.getAppPopupContentSubTitle}>
            {t('common:getAppPopupContentSubTitle')}
          </Typography>
          <View style={styles.storeButtonGroup}>
            <StoreButton
              store="appleLarge"
              containerStyle={styles.button}
              imageIconStyle={styles.imageIconStyle}
              mobileImageIconStyle={styles.appImageIconStyle}
            />
            <View style={styles.emptyView} />
            <StoreButton
              store="googleLarge"
              containerStyle={styles.button}
              imageIconStyle={styles.imageIconStyle}
              mobileImageIconStyle={styles.appImageIconStyle}
            />
          </View>
        </View>
      </View>
    );
  };
  return (
    <Popover
      content={renderPopoverContent()}
      popupProps={{
        closeOnDocumentClick: false,
        arrow: false,
        contentStyle: {
          maxHeight: '100%',
          alignItems: 'stretch',
          height: 500,
          width: isMobile ? 320 : 600,
          borderRadius: 8,
          overflow: 'auto',
        },
        children: undefined,
        modal: true,
        position: 'center center',
        onClose: onCloseModal,
      }}
      forwardedRef={popupRef}
    />
  );
};

export default GetAppPopup;

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  modalContent: {
    padding: 24,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  verticalStyle: {
    marginTop: 20,
  },
  closeButton: {
    zIndex: 1,
    position: 'absolute',
    right: 12,
    cursor: 'pointer',
    color: theme.colors.darkTint7,
  },
  button: {
    width: 200,
  },
  imageIconStyle: {
    height: 80,
    width: '100%',
    resizeMode: 'stretch',
  },
  appImageIconStyle: {
    width: '106px',
  },
  storeButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  getAppPopupContentTitle: {
    marginTop: 40,
    marginBottom: 20,
  },
  getAppPopupContentSubTitle: {
    marginBottom: 40,
  },
  emptyView: {
    marginHorizontal: 20,
  },
});
