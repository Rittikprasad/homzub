import React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle, TouchableOpacity } from 'react-native';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IIconWithCount {
  iconName: string;
  count: number;
  countColor?: string;
  circleBackgroundColor?: string;
  iconSize?: number;
  iconColor?: string;
  circleSize?: number;
  containerStyle?: ViewStyle;
  bottomOffset?: number;
  onPress?: () => void;
}

const CIRCLE_SIZE_DEFAULT = 55;
const ICON_SIZE_DEFAULT = 24;

const IconWithCount = (props: IIconWithCount): React.ReactElement => {
  const {
    iconName,
    count,
    countColor = theme.colors.white,
    iconColor = theme.colors.blue,
    iconSize = ICON_SIZE_DEFAULT,
    circleSize = CIRCLE_SIZE_DEFAULT,
    circleBackgroundColor = theme.colors.notificationRed,
    containerStyle,
    bottomOffset = iconSize / 3,
    onPress = FunctionUtils.noop,
  } = props;

  const styles = getStyles(circleSize, iconSize, countColor, circleBackgroundColor, bottomOffset);
  return (
    <TouchableOpacity style={[styles.container, containerStyle && containerStyle]} onPress={onPress}>
      <Icon name={iconName} size={iconSize} color={iconColor} />
      {count > 0 && (
        <View style={styles.circleView}>
          <Label textType="bold" type="small" style={styles.count}>
            {count}
          </Label>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default IconWithCount;

interface IStyles {
  container: ViewStyle;
  circleView: ViewStyle;
  count: TextStyle;
}

const getStyles = (
  circleSize: number,
  iconSize: number,
  countColor: string,
  circleBackgroundColor: string,
  bottomOffset: number
): IStyles => {
  const circleDimensions = circleSize / 3;
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    circleView: {
      width: circleDimensions,
      height: circleDimensions,
      borderRadius: circleSize,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      transform: [
        {
          translateX: iconSize / 1.5,
        },
        {
          translateY: -bottomOffset,
        },
      ],
      backgroundColor: circleBackgroundColor,
    },
    count: {
      color: countColor,
    },
  });
  return styles;
};
