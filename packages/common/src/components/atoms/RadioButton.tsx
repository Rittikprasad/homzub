import React from 'react';
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text, TextSizeType } from '@homzhub/common/src/components/atoms/Text';

interface IRadioButtonOptions {
  selected: boolean;
  label: string;
  onToggle: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  iconSize?: number;
  iconStyle?: object;
  iconSelectedStyle?: object;
  labelType?: TextSizeType;
}

const RadioButton = (props: IRadioButtonOptions): React.ReactElement => {
  const {
    label,
    selected,
    containerStyle = {},
    labelStyle = {},
    iconSize = 22,
    iconStyle = {},
    iconSelectedStyle = {},
    labelType = 'small',
    onToggle,
  } = props;
  const textStyle = StyleSheet.flatten([styles.label, selected && styles.selectedLabelStyle, labelStyle]);
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onToggle} testID="to">
      <Icon
        name={selected ? icons.circleFilled : icons.circleOutline}
        size={iconSize}
        color={selected ? theme.colors.primaryColor : theme.colors.disabled}
        style={selected ? iconSelectedStyle : iconStyle}
      />
      <Text type={labelType} textType="regular" style={textStyle}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export { RadioButton };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginStart: 12,
    color: theme.colors.darkTint4,
  },
  selectedLabelStyle: {
    color: theme.colors.darkTint1,
  },
});
