import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';

interface IProps {
  popupRef: React.RefObject<PopupActions>;
  onCloseModal: () => void;
  onPressDelete: () => void;
  headerTitle?: string;
  message?: string;
  buttonTitles?: string[];
  primaryButtonStyle?: StyleProp<ViewStyle>;
}

const DueConfirmPopover = (props: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const {
    popupRef,
    onCloseModal,
    onPressDelete,
    headerTitle = t('common:confirm'),
    message = t('property:deleteConfirmation'),
    buttonTitles = [t('common:cancel'), t('common:delete')],
    primaryButtonStyle,
  } = props;

  const renderPopoverContent = (): React.ReactElement => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography variant="text" size="small" fontWeight="bold">
            {headerTitle}
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
          <View style={styles.bottomSheet}>
            <Text type="small" style={styles.message}>
              {message}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                type="secondary"
                title={buttonTitles[0]}
                onPress={onCloseModal}
                titleStyle={styles.buttonTitle}
                containerStyle={styles.cancelButton}
              />
              <Button
                type="primary"
                title={buttonTitles[1]}
                titleStyle={styles.buttonTitle}
                onPress={onPressDelete}
                // @ts-ignore
                containerStyle={[styles.deleteButton, primaryButtonStyle]}
              />
            </View>
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
          borderRadius: 8,
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

export default DueConfirmPopover;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  cancelButton: {
    marginLeft: 10,
    flexDirection: 'row-reverse',
    height: 50,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    flexDirection: 'row-reverse',
    height: 50,
    backgroundColor: theme.colors.error,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 24,
  },
  buttonTitle: {
    marginHorizontal: 4,
  },
  bottomSheet: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  message: {
    textAlign: 'center',
    marginVertical: 10,
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
    overflowY: 'auto',
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
