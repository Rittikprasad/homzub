import React, { useState } from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  PickerItemProps,
  View,
  ImageStyle,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { FontWeightType, Label, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheetListView } from '@homzhub/mobile/src/components/molecules/BottomSheetListView';

export interface IProps {
  data: PickerItemProps[];
  value: number | string;
  onDonePress: (value: string | number, index?: number) => void;
  showImage?: boolean;
  image?: React.ReactElement | string;
  icon?: string;
  listTitle?: string;
  listHeight?: number;
  disable?: boolean;
  placeholder?: string;
  iosDropdownStyle?: object;
  androidDropdownStyle?: object;
  androidContainerStyle?: StyleProp<ViewStyle>;
  iconColor?: string;
  iconSize?: number;
  iconStyle?: StyleProp<ImageStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  parentContainerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  numColumns?: number;
  fontSize?: TextSizeType;
  fontWeight?: FontWeightType;
  isOutline?: boolean;
  backgroundColor?: string;
  dropdownIndex?: number;
  hasDynamicWidth?: boolean;
}
export const Dropdown = (props: IProps): React.ReactElement => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const { t } = useTranslation();
  const {
    value,
    data,
    iconStyle,
    listTitle,
    listHeight,
    disable = false,
    placeholder = '',
    onDonePress,
    parentContainerStyle = {},
    image,
    fontSize = 'large',
    testID,
    numColumns = 1,
    showImage = false,
    isOutline = false,
    backgroundColor,
    dropdownIndex = -1,
    hasDynamicWidth = false,
  } = props;

  let {
    icon = icons.downArrowFilled,
    fontWeight = 'regular',
    textStyle = {},
    containerStyle = {},
    iconSize = 16,
    iconColor = theme.colors.darkTint7,
  } = props;

  const onValueChange = (changedValue: string | number): void => {
    const selectedValue = changedValue === placeholder ? '' : changedValue;
    if (onDonePress) {
      onDonePress(selectedValue, dropdownIndex);
      closeDropdown();
    }
  };
  const openDropdown = (): void => setDropdownVisible(true);
  const closeDropdown = (): void => setDropdownVisible(false);
  const selectedItem = data.find((d: PickerItemProps) => d.value === value);
  // @ts-ignore   (Todo : Praharsh : resolve this using a custom type/interface)
  const label = selectedItem?.displayValueAfterSelection ?? selectedItem?.label;
  const placeholderColor = !label ? styles.placeholderColor : {};
  const disabledStyles = StyleSheet.flatten([disable && styles.disabled]);
  if (isOutline) {
    containerStyle = StyleSheet.flatten([
      containerStyle,
      {
        borderWidth: 0,
        backgroundColor: backgroundColor || theme.colors.lightGrayishBlue,
        borderRadius: 2,
      },
    ]);
    icon = icons.downArrow;
    fontWeight = 'semiBold';
    textStyle = StyleSheet.flatten([textStyle, { color: theme.colors.active }]);
    iconSize = 20;
    iconColor = theme.colors.active;
  }

  // @ts-ignore
  const RenderFlag = (): React.ReactElement => image;

  return (
    <View pointerEvents={disable ? 'none' : 'auto'} style={[disabledStyles, parentContainerStyle]}>
      <TouchableOpacity
        onPress={openDropdown}
        style={[
          styles.container,
          containerStyle,
          // @ts-ignore
          hasDynamicWidth && { width: selectedItem?.displayValueAfterSelection ? 100 : 140 },
        ]}
      >
        {showImage || !!image ? (
          image === 'globe' ? (
            <Icon name={icons.earthFilled} size={22} color={theme.colors.active} />
          ) : (
            <RenderFlag />
          )
        ) : (
          <Label
            type={fontSize}
            numberOfLines={1}
            textType={fontWeight}
            style={[styles.text, placeholderColor, textStyle]}
          >
            {label ?? placeholder}
          </Label>
        )}
        <Icon name={icon} size={iconSize} color={iconColor} style={[styles.iconStyle, iconStyle]} />
      </TouchableOpacity>
      <BottomSheetListView
        data={data}
        selectedValue={selectedItem?.value ?? ''}
        listTitle={listTitle ?? t('common:selectFromHere')}
        listHeight={listHeight}
        isBottomSheetVisible={dropdownVisible}
        onCloseDropDown={closeDropdown}
        onSelectItem={onValueChange}
        testID={testID}
        numColumns={numColumns}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.disabled,
  },
  iconStyle: {
    marginStart: 8,
  },
  placeholderColor: {
    color: theme.colors.darkTint8,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    flex: 1,
    color: theme.colors.dark,
  },
});
