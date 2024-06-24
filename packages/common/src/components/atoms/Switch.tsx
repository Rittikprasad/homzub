import React from 'react';
import { Switch, StyleSheet } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';

interface ISwitchOptions {
  selected: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

export const RNSwitch = (props: ISwitchOptions): React.ReactElement => {
  const { selected, onToggle, disabled } = props;
  return (
    <Switch
      disabled={disabled}
      style={styles.switch}
      trackColor={{ false: theme.colors.disabled, true: theme.colors.primaryColor }}
      ios_backgroundColor={theme.colors.disabled}
      thumbColor={theme.colors.white}
      onValueChange={onToggle}
      value={selected}
    />
  );
};

const scale = PlatformUtils.isAndroid() ? 1 : 0.7;
const styles = StyleSheet.create({
  switch: {
    transform: [{ scaleX: scale }, { scaleY: scale }],
  },
});
