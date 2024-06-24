import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { AnimatedNode } from '@homzhub/mobile/src/services/AnimationService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { fontFamilies } from '@homzhub/common/src/components/atoms/Text';
import { StatusBar, IStatusBarProps } from '@homzhub/mobile/src/components/atoms/StatusBar';

export interface IHeaderProps {
  type?: 'primary' | 'secondary';
  icon?: string;
  iconRight?: string;
  title?: string;
  subTitle?: string;
  barVisible?: boolean;
  children?: React.ReactNode;
  statusBarProps?: IStatusBarProps;
  opacity?: AnimatedNode<number>;
  onIconPress?: () => void;
  onIconRightPress?: () => void;
  testID?: string;
  textRight?: string;
  textRightColor?: string;
}
const BOTTOM_PADDING = 12;

const Header = (props: IHeaderProps): React.ReactElement => {
  const {
    title,
    iconRight,
    type = 'primary',
    icon = icons.leftArrow,
    barVisible = false,
    testID,
    children,
    statusBarProps,
    opacity = 1,
    onIconPress,
    onIconRightPress,
    textRight,
    subTitle,
    textRightColor,
  } = props;

  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  let backgroundColor = theme.colors.primaryColor;
  let textColor = theme.colors.white;
  let statusBarType = 'light-content';
  if (type === 'secondary') {
    backgroundColor = theme.colors.white;
    textColor = theme.colors.darkTint1;
    statusBarType = 'dark-content';
  }

  return (
    <View style={{ backgroundColor }}>
      <StatusBar
        statusBarBackground={backgroundColor}
        barStyle={statusBarType as 'light-content' | 'dark-content'}
        {...statusBarProps}
      />
      <>
        <View style={[styles.container, { backgroundColor }]} testID={testID}>
          <Icon name={icon} size={22} color={textColor} style={styles.icon} onPress={onIconPress} />
          <Animated.Text numberOfLines={1} style={[styles.title, { color: textColor, opacity }]}>
            {title ?? ''}
          </Animated.Text>
          {iconRight && (
            <Icon name={iconRight} size={22} color={textColor} style={styles.itemRight} onPress={onIconRightPress} />
          )}
          {!iconRight && textRight && (
            <AnimatedTouchableOpacity style={[styles.itemRight, { opacity }]} onPress={onIconRightPress}>
              <Animated.Text numberOfLines={1} style={[styles.textRight, { color: textRightColor }]}>
                {textRight}
              </Animated.Text>
            </AnimatedTouchableOpacity>
          )}
        </View>
        {subTitle && (
          <Animated.Text numberOfLines={1} style={[styles.subTitle, { opacity }]}>
            {subTitle}
          </Animated.Text>
        )}
      </>
      {children}
      {barVisible && <View style={styles.bar} />}
      <Animated.View style={[styles.animatedDivider, { opacity }]} />
    </View>
  );
};

const memoizedComponent = React.memo(Header);
export { memoizedComponent as Header };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  bar: {
    height: 4,
    backgroundColor: theme.colors.green,
  },
  title: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
    width: 300,
  },
  subTitle: {
    fontFamily: fontFamilies.english.regular,
    fontSize: 12,
    textAlign: 'center',
    transform: [{ translateY: -10 }],
    color: theme.colors.darkTint5,
  },
  icon: {
    position: 'absolute',
    bottom: BOTTOM_PADDING,
    left: 12,
  },
  itemRight: {
    position: 'absolute',
    bottom: BOTTOM_PADDING,
    right: 16,
  },
  textRight: {
    color: theme.colors.primaryColor,
    fontSize: 16,
  },
  animatedDivider: {
    height: 0,
    backgroundColor: theme.colors.disabled,
  },
});
