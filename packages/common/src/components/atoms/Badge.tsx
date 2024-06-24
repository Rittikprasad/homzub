import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { FontWeightType, Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  title: string;
  badgeColor: string;
  badgeStyle?: StyleProp<ViewStyle>;
  textType?: FontWeightType;
  titleStyle?: StyleProp<TextStyle>;
}

export const Badge = (props: IProps): React.ReactElement => {
  const { badgeColor, badgeStyle, title, textType = 'semiBold', titleStyle = {} } = props;
  return (
    <View style={[styles.badge, badgeStyle, { backgroundColor: badgeColor }]}>
      <Label type="regular" textType={textType} style={[styles.title, titleStyle]}>
        {title}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 2,
    paddingHorizontal: 6,
  },
  title: {
    color: theme.colors.white,
    paddingBottom: 0,
    alignSelf: 'center',
  },
});
