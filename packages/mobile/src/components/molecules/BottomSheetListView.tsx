import React, { Component } from 'react';
import { FlatList, PickerItemProps, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { ListItem } from '@homzhub/common/src/components/atoms/ListItem';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';

export interface IListItem extends PickerItemProps {
  isNegative?: boolean;
  isDisable?: boolean;
}
interface IProps<T> {
  data: IListItem[];
  selectedValue: string;
  listTitle: string;
  listHeight?: number;
  isBottomSheetVisible: boolean;
  onCloseDropDown: () => void;
  onSelectItem: (value: T) => void;
  testID?: string;
  numColumns?: number;
  showDivider?: boolean;
  hasFullySpannedItems?: boolean;
  extraContent?: () => React.ReactElement;
}

const LIST_HEIGHT = theme.viewport.height <= theme.DeviceDimensions.SMALL.height ? 450 : 700;
export class BottomSheetListView<T> extends Component<IProps<T>> {
  public render(): React.ReactNode {
    const {
      isBottomSheetVisible,
      onCloseDropDown,
      selectedValue,
      listTitle,
      data,
      listHeight = LIST_HEIGHT,
      numColumns = 1,
      extraContent,
    } = this.props;
    return (
      <BottomSheet
        isShadowView
        sheetHeight={listHeight}
        headerTitle={listTitle}
        visible={isBottomSheetVisible}
        onCloseSheet={onCloseDropDown}
      >
        <>
          {extraContent && extraContent()}
          <FlatList
            data={data}
            renderItem={this.renderSheetItem}
            keyExtractor={this.renderKeyExtractor}
            extraData={selectedValue}
            numColumns={numColumns}
            ItemSeparatorComponent={this.itemSeparator}
          />
        </>
      </BottomSheet>
    );
  }

  private renderSheetItem = ({ item, index }: { item: IListItem; index: number }): React.ReactElement => {
    const { selectedValue, onSelectItem, testID, numColumns = 1, hasFullySpannedItems } = this.props;
    // @ts-ignore
    const onItemSelect = (): void => onSelectItem(item.value);
    const isCheck: boolean = selectedValue === item.value;

    const returnStyles = (): StyleProp<ViewStyle | TextStyle> => {
      if (!hasFullySpannedItems) {
        return [styles.item, numColumns > 1 && styles.itemWidth];
      }
      return undefined;
    };

    return (
      <ListItem
        // @ts-ignore
        listItem={item}
        isCheck={isCheck}
        onItemSelect={onItemSelect}
        key={index}
        testID={testID}
        isDisable={item.isDisable}
        // @ts-ignore
        listItemViewStyle={returnStyles()}
        itemStyle={[item.isNegative && styles.redText, item.isDisable && styles.disable]}
        hasFullySpannedItems={hasFullySpannedItems}
      />
    );
  };

  private renderKeyExtractor = (item: PickerItemProps, index: number): string => {
    const { value } = item;
    return `${value}-${index}`;
  };

  private itemSeparator = (): React.ReactElement | null => {
    const { numColumns, showDivider = true } = this.props;
    if ((numColumns && numColumns > 1) || !showDivider) {
      return null;
    }
    return <Divider />;
  };
}

const styles = StyleSheet.create({
  item: {
    width: theme.viewport.width / 1.15,
    color: theme.colors.darkTint5,
  },
  itemWidth: {
    width: theme.viewport.width / 2.5,
    
  },
  redText: {
    color: theme.colors.error,
    
  },
  disable: {
    color: theme.colors.disabled,
  },
});
