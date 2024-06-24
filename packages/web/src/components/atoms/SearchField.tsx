import React, { FC } from 'react';
import { StyleProp, StyleSheet, TextInput, View, ViewStyle, LayoutChangeEvent } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  forwardRef?: React.Ref<TextInput>;
  placeholder: string;
  value: string;
  updateValue: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
  onLayoutChange?: (e: LayoutChangeEvent) => void;
}

export const SearchField: FC<IProps> = (props: IProps) => {
  const { forwardRef, placeholder, value, containerStyle = {}, onLayoutChange } = props;
  const onChangeText = (changedValue: string): void => {
    const { updateValue } = props;
    updateValue(changedValue);
  };
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  return (
    <View style={[styles.container, containerStyle, isMobile && styles.mobileContainer]} onLayout={onLayoutChange}>
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
      <Button
        type="primary"
        icon={icons.search}
        iconSize={20}
        iconColor={theme.colors.darkTint6}
        containerStyle={styles.iconButton}
        testID="btnSearch"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.darkTint10,
    backgroundColor: theme.colors.secondaryColor,
  },
  mobileContainer: {
    borderWidth: 0,
    width: '100%',
  },
  textInput: {
    flex: 1,
    marginRight: 8,
  },
  textInputMobile: {
    width: '90%',
  },
  iconButton: {
    backgroundColor: theme.colors.secondaryColor,
  },
});
