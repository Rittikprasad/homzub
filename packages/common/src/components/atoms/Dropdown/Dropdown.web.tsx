import React, { useState } from "react";
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  PickerItemProps,
  View,
  ImageStyle,
  TouchableOpacity,
  TextStyle,
} from "react-native";
import Icon, { icons } from "@homzhub/common/src/assets/icon";
import { theme } from "@homzhub/common/src/styles/theme";
import {
  FontWeightType,
  Label,
  TextSizeType,
} from "@homzhub/common/src/components/atoms/Text";
import { IPopupOptions } from "@homzhub/web/src/components/molecules/PopupMenuOptions";
import DropDownWeb from "@homzhub/web/src/components/molecules/Dropdown";
import { ref } from "yup";
import { PlatformUtils } from "@homzhub/common/src/utils/PlatformUtils";

export interface IProps {
  data: PickerItemProps[];
  value: number | string;
  onDonePress: (value: any) => void;
  showImage?: boolean;
  image?: string | React.ReactElement;
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
}

export const Dropdown = (props: IProps): React.ReactElement => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const {
    value,
    data,
    iconStyle,
    disable = false,
    placeholder = "",
    onDonePress,
    parentContainerStyle = {},
    image,
    fontSize = "large",
    showImage = false,
    isOutline = false,
  } = props;
  let {
    icon = icons.downArrowFilled,
    fontWeight = "regular",
    textStyle = {},
    containerStyle = {},
    iconSize = 16,
    iconColor = theme.colors.darkTint7,
  } = props;

  const valueChange = (changedValue: IPopupOptions): void => {
    const selectedValue =
      !changedValue.value || changedValue.value === placeholder
        ? ""
        : changedValue.value;
    // @ts-ignore
    let isValid = false;
    if (typeof selectedValue === "string") {
      isValid = selectedValue.length > 0;
    } else {
      isValid = selectedValue > -1;
    }
    if (onDonePress && isValid) {
      onDonePress(selectedValue);
      closeDropdown();
    }
  };

  const openDropdown = (): void => setDropdownVisible(true);
  const closeDropdown = (): void => setDropdownVisible(false);
  const selectedItem = data.find((d: PickerItemProps) => d.value === value);
  const label = selectedItem?.label;
  const placeholderColor = !label ? styles.placeholderColor : {};
  const disabledStyles = StyleSheet.flatten([disable && styles.disabled]);

  if (isOutline) {
    containerStyle = StyleSheet.flatten([
      containerStyle,
      {
        borderWidth: 0,
        backgroundColor: theme.colors.lightGrayishBlue,
        borderRadius: 2,
      },
    ]);
    icon = icons.downArrow;
    fontWeight = "semiBold";
    textStyle = StyleSheet.flatten([textStyle, { color: theme.colors.active }]);
    iconSize = 20;
    iconColor = theme.colors.active;
  }

  console.log(dropdownVisible, "77777777777777");

  // @ts-ignore
  const RenderFlagSvg = (): React.ReactElement => image;

  const DropDownView = (ref): React.ReactElement => {
    return (
      <TouchableOpacity
        onPress={() => {
          PlatformUtils.isWeb() && ref.current?.toggle();
          openDropdown();
        }}
        style={[styles.container, containerStyle]}
      >
        {showImage && !!image ? (
          image === "globe" ? (
            <Icon
              name={icons.earthFilled}
              size={22}
              color={theme.colors.active}
            />
          ) : (
            <RenderFlagSvg />
          )
        ) : (
          <View>
            <Label
              type={fontSize}
              numberOfLines={1}
              textType={fontWeight}
              style={[styles.text, placeholderColor, textStyle]}
            >
              {label ?? placeholder}
            </Label>
          </View>
        )}

        <Icon
          name={icon}
          size={iconSize}
          color={iconColor}
          style={[styles.iconStyle, iconStyle]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      pointerEvents={disable ? "none" : "auto"}
      style={[disabledStyles, parentContainerStyle]}
    >
      <DropDownWeb
        data={data}
        valueChange={valueChange}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
        content={PlatformUtils.isWeb() ? DropDownView : DropDownView()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
});
