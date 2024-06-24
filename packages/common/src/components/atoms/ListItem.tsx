import React from 'react';
import { TouchableOpacity, View, StyleSheet, StyleProp, ViewStyle, PickerItemProps, TextStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IListItemProps {
  listItem: PickerItemProps;
  isCheck: boolean;
  isDisable?: boolean;
  onItemSelect?: () => void;
  listItemViewStyle?: StyleProp<ViewStyle>;
  itemContentStyle?: StyleProp<ViewStyle>;
  testID?: string;
  itemStyle?: StyleProp<TextStyle>;
  hasFullySpannedItems?: boolean;
}

export const ListItem = (props: IListItemProps): React.ReactElement => {
  const {
    listItem,
    onItemSelect,
    isCheck,
    listItemViewStyle,
    itemContentStyle,
    testID,
    itemStyle,
    hasFullySpannedItems = false,
    isDisable = false,
  } = props;
  return (
    <View style={[hasFullySpannedItems ? styles.fullySpannedItems : styles.listItemView, listItemViewStyle]}>
      <TouchableOpacity
        disabled={isDisable}
        style={[styles.itemContent, itemContentStyle]}
        onPress={onItemSelect}
        testID={testID}
      >
        <Text type="small" textType="regular" style={[styles.item, itemStyle && itemStyle]}>
          {listItem.label}
        </Text>
        {isCheck && <Icon name={icons.checkFilled} size={16} color={theme.colors.primaryColor} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  listItemView: {
    marginHorizontal: 26,
  },
  item: {
    paddingVertical: 16,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fullySpannedItems: {
    paddingHorizontal: 26,
  },
});
