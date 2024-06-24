import React, { ReactElement } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { FontWeightType, Text, TextSizeType } from '@homzhub/common/src/components/atoms/Text';

interface IOwnProps {
  title: string;
  titleTextSize?: TextSizeType;
  titleFontWeight?: FontWeightType;
  subTitle?: string;
  icon?: string;
  iconBackSize?: number;
  handleIcon?: () => void;
  onIconPress?: () => void;
  onClearPress?: () => void;
  clear?: number;
  iconSize?: number;
  iconStyle?: StyleProp<ViewStyle>;
  containerStyles?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  renderItem?: () => ReactElement | null;
}

export class HeaderCard extends React.PureComponent<IOwnProps> {
  public render(): ReactElement {
    const {
      title,
      onIconPress,
      containerStyles,
      onClearPress,
      subTitle,
      renderItem,
      icon,
      handleIcon,
      headerStyle,
      iconBackSize = 30,
      iconSize = 26,
      iconStyle,
      titleTextSize = 'regular',
      titleFontWeight = 'bold',
    } = this.props;

    return (
      <View style={[styles.container, containerStyles]}>
        <View style={[styles.headerView, headerStyle]}>
          <View style={styles.iconContainer}>
            <Icon
              size={iconBackSize}
              name={icons.leftArrow}
              color={theme.colors.primaryColor}
              style={styles.backIconStyle}
              onPress={onIconPress}
            />
            <Text type={titleTextSize} textType={titleFontWeight}>
              {title}
            </Text>
          </View>
          {onClearPress && subTitle && (
            <TouchableOpacity onPress={onClearPress}>
              <Text type="small" textType="bold" style={styles.clearText}>
                {subTitle}
              </Text>
            </TouchableOpacity>
          )}
          {!!icon && (
            <TouchableOpacity onPress={handleIcon}>
              <Icon size={iconSize} name={icon} color={theme.colors.primaryColor} style={iconStyle} />
            </TouchableOpacity>
          )}
        </View>
        {renderItem && renderItem()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    backgroundColor: theme.colors.white,
    padding: theme.layout.screenPadding,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIconStyle: {
    paddingRight: 12,
  },
  clearText: {
    color: theme.colors.primaryColor,
  },
});
