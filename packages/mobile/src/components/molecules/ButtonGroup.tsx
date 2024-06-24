import React from 'react';
import { TouchableOpacity, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IButtonGroupItem<T> {
  title: string;
  value: T;
}

interface IButtonGroupProps<T> {
  data: IButtonGroupItem<T>[];
  onItemSelect: (value: T) => void;
  selectedItem: T;
  containerStyle?: StyleProp<ViewStyle>;
  buttonItemStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export class ButtonGroup<T> extends React.PureComponent<IButtonGroupProps<T>> {
  public render(): React.ReactElement {
    const { data, containerStyle = {} } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        {data.map((item: IButtonGroupItem<T>, index) => {
          return this.renderItem(item, index);
        })}
      </View>
    );
  }

  public renderItem = (item: IButtonGroupItem<T>, index: number): React.ReactElement => {
    const { selectedItem, onItemSelect, buttonItemStyle = {}, testID = 'btngrp' } = this.props;

    // Styles
    const isSelected = item.value === selectedItem;
    const textStyle = StyleSheet.flatten([styles.textStyle, isSelected && styles.selectedTextStyle]);
    const buttonItemContainerStyle = StyleSheet.flatten([
      styles.item,
      isSelected && styles.selectedContainerStyle,
      index % 2 === 0 && { marginEnd: 16 },
      buttonItemStyle,
    ]);

    const onItemPress = (): void => onItemSelect(item.value);

    return (
      <TouchableOpacity onPress={onItemPress} style={buttonItemContainerStyle} key={item.title} testID={testID}>
        <Label type="large" textType={isSelected ? 'semiBold' : 'regular'} style={textStyle}>
          {item.title}
        </Label>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  item: {
    flex: 0.5,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.disabled,
    backgroundColor: theme.colors.white,
  },
  selectedContainerStyle: {
    backgroundColor: theme.colors.primaryColor,
  },
  textStyle: {
    color: theme.colors.darkTint5,
  },
  selectedTextStyle: {
    color: theme.colors.white,
  },
});
