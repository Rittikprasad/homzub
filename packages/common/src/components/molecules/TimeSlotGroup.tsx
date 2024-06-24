import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp, FlatList } from 'react-native';
import { isArray } from 'lodash';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, TextFieldType, TextSizeType, FontWeightType } from '@homzhub/common/src/components/atoms/Text';
import { ISlotItem } from '@homzhub/common/src/domain/models/AssetVisit';

interface ITimeSlotProps {
  data: ISlotItem[];
  onItemSelect: (id: number) => void;
  selectedItem: number[] | number;
  selectedDate?: string;
  containerStyle?: StyleProp<ViewStyle>;
  buttonItemStyle?: StyleProp<ViewStyle>;
  textType?: TextFieldType;
  textSize?: TextSizeType;
  fontType?: FontWeightType;
  testID?: string;
}

export class TimeSlotGroup extends React.PureComponent<ITimeSlotProps> {
  public render(): React.ReactElement {
    const { data, containerStyle = {} } = this.props;
    return (
      <FlatList
        data={data}
        style={containerStyle}
        numColumns={2}
        renderItem={({ item, index }): React.ReactElement => this.renderItem(item, index)}
      />
    );
  }

  public renderItem = (item: ISlotItem, index: number): React.ReactElement => {
    const { selectedItem, onItemSelect, fontType = 'regular', buttonItemStyle = {}, selectedDate = '' } = this.props;
    const isDisabled = DateUtils.isPastTime(item.from, selectedDate);
    let isSelected;
    if (isArray(selectedItem)) {
      isSelected = selectedItem.includes(item.id);
    } else {
      isSelected = selectedItem === item.id;
    }

    // Styles
    const textStyle = StyleSheet.flatten([styles.textStyle, isSelected && styles.selectedTextStyle]);
    const buttonItemContainerStyle = StyleSheet.flatten([
      styles.item,
      isSelected && styles.selectedContainerStyle,
      isDisabled && styles.disabledStyle,
      buttonItemStyle,
      index % 2 !== 0 && styles.separator,
    ]);

    const onItemPress = (): void => onItemSelect(item.id);

    return (
      <TouchableOpacity
        activeOpacity={isDisabled ? 1 : 0.5}
        onPress={!isDisabled ? onItemPress : FunctionUtils.noop}
        style={buttonItemContainerStyle}
        key={item.id}
        testID="selectSlot"
      >
        <Icon name={item.icon} size={20} color={isSelected ? theme.colors.white : theme.colors.darkTint4} />
        <Label type="large" textType={fontType} style={textStyle}>
          {item.formatted}
        </Label>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexGrow: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.disabled,
    backgroundColor: theme.colors.white,
  },
  selectedContainerStyle: {
    backgroundColor: theme.colors.primaryColor,
  },
  textStyle: {
    color: theme.colors.darkTint4,
    marginLeft: 6,
  },
  selectedTextStyle: {
    color: theme.colors.white,
  },
  disabledStyle: {
    backgroundColor: theme.colors.darkTint10,
  },
  separator: {
    marginLeft: 16,
  },
});
