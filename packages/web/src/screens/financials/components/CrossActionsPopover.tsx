import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';

export interface ISheetData {
  icon: React.ReactElement;
  label: string;
  onPress: () => void;
}

interface IProps {
  data: ISheetData[];
  isOpen?: boolean;
  numOfColumns?: number;
  headerTitle?: string;
  popupRef: React.RefObject<PopupActions>;
  onCloseModal: () => void;
}

const CrossActionsPopover = (props: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const { data, numOfColumns = 2, headerTitle = t('common:quickActions'), popupRef, onCloseModal } = props;

  const keyExtractor = (item: ISheetData, index: number): string => `${item}:${index}`;

  const renderItem = ({ item }: { item: ISheetData }): React.ReactElement => {
    const { icon, label, onPress } = item;

    const onPressItem = (): void => {
      onPress();
      onCloseModal();
    };

    return (
      <>
        <TouchableOpacity style={styles.bottomSheetItemContainer} onPress={onPressItem}>
          {icon}
          {/* @ts-ignore */}
          <Label type="large" textType="semiBold" style={styles.itemLabel}>
            {label}
          </Label>
        </TouchableOpacity>
      </>
    );
  };

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
          <FlatList
            data={data}
            numColumns={numOfColumns}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.flatList}
          />
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

export default CrossActionsPopover;

const styles = StyleSheet.create({
  bottomSheetItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  itemLabel: {
    marginTop: 10,
    textAlign: 'center',
    color: theme.colors.gray15,
  },
  flatList: {
    marginBottom: 30,
    marginHorizontal: 24,
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
