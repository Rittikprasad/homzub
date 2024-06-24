import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IContentProps {
  isCheckboxSelected: boolean;
  handleCheckBox: () => void;
  onProceed: () => void;
}

interface IPopoverProps extends IContentProps {
  popupRef: React.MutableRefObject<PopupActions | null>;
  onCloseModal: () => void;
  isOpen?: boolean;
}

const BankVerificationPopover = (props: IPopoverProps): React.ReactElement => {
  const { popupRef, onCloseModal, handleCheckBox, onProceed, isCheckboxSelected } = props;
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();
  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography size="small" variant="text" fontWeight="bold">
            {t('property:verification')}
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
          <View style={styles.sheetContainer}>
            <RNCheckbox
              selected={isCheckboxSelected}
              label={t('propertyPayment:verificationMsg')}
              onToggle={handleCheckBox}
            />
            <Button
              type="primary"
              title={t('common:proceed')}
              onPress={onProceed}
              disabled={!isCheckboxSelected}
              containerStyle={styles.buttonContainer}
              titleStyle={styles.buttonTitle}
            />
          </View>
        </View>
      </View>
    );
  };
  return (
    <Popover
      content={renderPopoverContent}
      popupProps={{
        closeOnDocumentClick: false,
        arrow: false,
        contentStyle: {
          maxHeight: '100%',
          alignItems: 'stretch',
          width: isMobile ? 320 : 400,
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

export default BankVerificationPopover;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 0,
    height: 50,
    marginVertical: 20,
  },
  buttonTitle: {
    marginVertical: 4,
  },
  sheetContainer: {
    marginHorizontal: 24,
  },
  container: {
    marginTop: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  modalContent: {
    padding: 24,
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
});
