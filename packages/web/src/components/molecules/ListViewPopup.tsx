import React from 'react';
import { FlatList, PickerItemProps, StyleSheet, StyleProp, ViewStyle, View, TextStyle } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { ListItem } from '@homzhub/common/src/components/atoms/ListItem';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

export interface IListItem extends PickerItemProps {
  isNegative?: boolean;
}
interface IProps {
  popupRef: React.MutableRefObject<PopupActions | null>;
  onCloseModal: () => void;
  data: IListItem[];
  listTitle: string;
  onSelectItem: (value: any) => void;
  numColumns?: number;
  selectedValue?: string;
  listHeight?: number;
  showDivider?: boolean;
  hasFullySpannedItems?: boolean;
}

const LIST_HEIGHT = theme.viewport.height <= theme.DeviceDimensions.SMALL.height ? 450 : 500;

const ListViewPopup: React.FC<IProps> = (props: IProps) => {
  const {
    numColumns = 1,
    showDivider = true,
    listTitle,
    onCloseModal,
    popupRef,
    data,
    selectedValue,
    hasFullySpannedItems,
    listHeight = LIST_HEIGHT,
    onSelectItem,
  } = props;
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const renderKeyExtractor = (item: PickerItemProps, index: number): string => {
    const { value } = item;
    return `${value}-${index}`;
  };

  const itemSeparator = (): React.ReactElement | null => {
    if ((numColumns && numColumns > 1) || !showDivider) {
      return null;
    }
    return <Divider />;
  };
  const renderSheetItem = ({ item, index }: { item: IListItem; index: number }): React.ReactElement => {
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
        // @ts-ignore
        listItemViewStyle={returnStyles()}
        itemStyle={[item.isNegative && styles.redText]}
        hasFullySpannedItems={hasFullySpannedItems}
      />
    );
  };
  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <View style={styles.modalHeader}>
          <Typography variant="text" size="small" fontWeight="bold">
            {listTitle}
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
            renderItem={renderSheetItem}
            keyExtractor={renderKeyExtractor}
            extraData={selectedValue}
            numColumns={numColumns}
            ItemSeparatorComponent={itemSeparator}
          />
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
          height: listHeight,
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

export default ListViewPopup;

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
});
