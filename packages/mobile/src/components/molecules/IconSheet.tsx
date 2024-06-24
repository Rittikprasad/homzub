import React from 'react';
import { FlatList, StyleProp, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';

export interface ISheetData {
  icon: React.ReactElement;
  label: string;
  onPress: () => void;
}

interface IOwnProps {
  data: ISheetData[];
  onCloseSheet: () => void;
  isVisible?: boolean;
  numOfColumns?: number;
  sheetHeight?: number;
  headerTitle?: string;
}

const IconSheet = (props: IOwnProps): React.ReactElement => {
  const { t } = useTranslation();
  const {
    data,
    isVisible = false,
    onCloseSheet,
    numOfColumns = 2,
    sheetHeight = 375,
    headerTitle = t('common:quickActions'),
  } = props;

  const keyExtractor = (item: ISheetData, index: number): string => `${item}:${index}`;

  const renderItem = ({ item }: { item: ISheetData }): React.ReactElement => {
    const { icon, label, onPress } = item;

    const onPressItem = (): void => {
      onPress();
      onCloseSheet();
    };

    return (
      <>
        <TouchableOpacity style={styles.bottomSheetItemContainer()} onPress={onPressItem}>
          {icon}
          {/* @ts-ignore */}
          <Label type="large" textType="semiBold" style={styles.itemLabel()}>
            {label}
          </Label>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <BottomSheet headerTitle={headerTitle} visible={isVisible} onCloseSheet={onCloseSheet} sheetHeight={sheetHeight}>
      <FlatList
        data={data}
        numColumns={numOfColumns}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.flatList()}
      />
    </BottomSheet>
  );
};

export default IconSheet;

const styles = {
  bottomSheetItemContainer: (): StyleProp<ViewStyle> => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 16,
  }),
  itemLabel: (): StyleProp<TextStyle> => ({
    marginTop: 10,
    textAlign: 'center',
    color: theme.colors.gray15,
  }),
  flatList: (): StyleProp<ViewStyle> => ({
    marginBottom: 30,
    marginHorizontal: 24,
  }),
};
