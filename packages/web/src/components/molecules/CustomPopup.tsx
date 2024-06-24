import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  popupRef: React.MutableRefObject<PopupActions | null>;
  onOpenModal: () => void;
  onCloseModal: () => void;
  children: React.ReactElement;
  title: string;
  isOpen?: boolean;
  onSuccessCallback?: (message?: string) => void;
  contentStyle?: StyleProp<ViewStyle>;
}

const CustomPopup: React.FC<IProps> = (props: IProps) => {
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const { popupRef, onCloseModal, children: renderChildren, title, contentStyle, onOpenModal, isOpen } = props;

  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography variant="text" size="small" fontWeight="bold">
            {title}
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
        <View style={styles.modalContent}>{renderChildren}</View>
      </View>
    );
  };

  return (
    <Popover
      content={renderPopoverContent}
      popupProps={{
        open: isOpen,
        closeOnDocumentClick: false,
        arrow: false,
        contentStyle: {
          maxHeight: '100%',
          alignItems: 'stretch',
          width: isMobile ? 320 : 400,
          borderRadius: 8,
          overflow: 'auto',
          height: 650,
          ...{ contentStyle },
        },
        children: undefined,
        modal: true,
        position: 'center center',
        onOpen: onOpenModal,
        onClose: onCloseModal,
      }}
      forwardedRef={popupRef}
    />
  );
};

export default CustomPopup;

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
