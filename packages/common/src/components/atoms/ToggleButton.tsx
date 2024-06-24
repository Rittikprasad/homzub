import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  onToggle: () => void;
  title: string;
  icon: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const ToggleButton = ({ onToggle, title, icon, containerStyle }: IProps): React.ReactElement => {
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onToggle}>
      <Text type="small" style={styles.title}>
        {title}
      </Text>
      <Icon name={icon} style={styles.iconStyle} size={18} color={theme.colors.primaryColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primaryColor,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  title: {
    color: theme.colors.primaryColor,
  },
  iconStyle: {
    marginLeft: 8,
  },
});
