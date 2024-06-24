import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProps {
  containerStyles?: StyleProp<ViewStyle>;
}

class Divider extends React.PureComponent<IProps> {
  public render(): React.ReactNode {
    const { containerStyles = {} } = this.props;
    const dividerStyles = [styles.separator, containerStyles];
    return <View style={dividerStyles} />;
  }
}

const styles = StyleSheet.create({
  separator: {
    borderColor: PlatformUtils.isWeb() ? theme.colors.background : theme.colors.disabled,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export { Divider };
