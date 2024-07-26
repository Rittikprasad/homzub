// @ts-nocheck
import React, { FC } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useDown } from "@homzhub/common/src/utils/MediaQueryUtils";
import { theme } from "@homzhub/common/src/styles/theme";
import Icon, { icons } from "@homzhub/common/src/assets/icon";
import { Button } from "@homzhub/common/src/components/atoms/Button";
import { deviceBreakpoint } from "@homzhub/common/src/constants/DeviceBreakpoints";

interface IProps {
  forwardRef?: React.Ref<TextInput>;
  placeholder: string;
  value: string;
  updateValue: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
  onLayoutChange?: (e: LayoutChangeEvent) => void;
  onSearchPress: (value: string) => void;
}

export const SearchFieldButton: FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const {
    forwardRef,
    placeholder,
    value,
    containerStyle = {},
    onLayoutChange,
    updateValue,
    onSearchPress,
  } = props;
  const onChangeText = (changedValue: string): void => {
    updateValue(changedValue);
  };
  const isMobile = useDown(deviceBreakpoint.MOBILE);

  const onClosePress = (): void => {
    updateValue("");
  };
  return (
    <View style={[styles.container, containerStyle]} onLayout={onLayoutChange}>
      <Button
        type="primary"
        icon={icons.search}
        iconSize={20}
        iconColor={theme.colors.darkTint6}
        containerStyle={styles.iconButton}
        testID="btnSearch"
        disabled
      />
      <TextInput
        ref={forwardRef}
        style={[styles.textInput, isMobile && styles.textInputMobile]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.darkTint7}
        autoCorrect={false}
        onChangeText={onChangeText}
        testID="textInput"
      />
      {value && (
        <Icon
          name={icons.close}
          color={theme.colors.darkTint4}
          size={18}
          onPress={onClosePress}
          style={styles.closeIconStyle}
        />
      )}
      <Button
        type="primary"
        title={t("common:search")}
        textStyle={styles.searchTextStyle}
        testID="btnSearch"
        disabled={!value}
        onPress={(): void => onSearchPress(value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.darkTint10,
    backgroundColor: theme.colors.secondaryColor,
  },

  textInput: {
    flex: 1,
    marginRight: 8,
  },
  textInputMobile: {
    width: "70%",
  },
  iconButton: {
    backgroundColor: theme.colors.secondaryColor,
    paddingRight: "4%",
  },
  searchTextStyle: {
    marginHorizontal: "20px",
    marginVertical: "2px",
  },
  closeIconStyle: {
    paddingRight: "1%",
  },
});
