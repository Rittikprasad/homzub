import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';

export interface IShadowViewProps {
  children: React.ReactElement;
  outerViewStyle?: StyleProp<ViewStyle>;
  shadowViewStyle?: StyleProp<ViewStyle>;
  isBottomShadow?: boolean;
}

export const WithShadowView = (props: IShadowViewProps): React.ReactElement => {
  const {
    children,
    shadowViewStyle,
    isBottomShadow,
    outerViewStyle = !isBottomShadow && styles.defaultShadowView,
  } = props;
  return (
    <View style={[styles.outerView, outerViewStyle]}>
      <View style={[styles.shadowView, shadowViewStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerView: {
    overflow: 'hidden',
    paddingBottom: 10,
  },
  defaultShadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  shadowView: {
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.darkTint7,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4.65,
    elevation: 7,
  },
});
