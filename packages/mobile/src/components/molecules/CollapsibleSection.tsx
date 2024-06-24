import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface ICollapsibleSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  onCollapse?: (isCollapsed: boolean) => void;
  isDividerRequired?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  initialCollapsedValue?: boolean;
  isCollapsibleRequired?: boolean;
  collapseIcon?: string;
  expandIcon?: string;
  iconStyle?: StyleProp<ViewStyle>;
}
const CollapsibleSection = (props: ICollapsibleSectionProps): React.ReactElement => {
  const {
    title,
    children,
    initialCollapsedValue = false,
    icon,
    titleStyle,
    isDividerRequired = false,
    onCollapse,
    isCollapsibleRequired = true,
    containerStyle,
    collapseIcon = icons.minus,
    expandIcon = icons.plus,
    iconStyle,
  } = props;
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsedValue);

  const onPress = (): void => {
    setIsCollapsed(!isCollapsed);
    if (onCollapse) {
      onCollapse(!isCollapsed);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={styles.ratingsHeading}
        disabled={!isCollapsibleRequired}
        onPress={onPress}
        testID="collapse"
      >
        <View style={styles.leftView}>
          {icon && <Icon name={icon} size={22} color={theme.colors.darkTint4} />}
          <Text type="small" textType="semiBold" style={[styles.textColor, titleStyle]}>
            {title}
          </Text>
        </View>
        {isCollapsibleRequired && (
          <Icon
            name={isCollapsed ? expandIcon : collapseIcon}
            size={20}
            color={theme.colors.darkTint4}
            style={iconStyle}
          />
        )}
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>{children}</Collapsible>
      {isDividerRequired && <Divider containerStyles={styles.divider} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  divider: {
    marginTop: 24,
    borderColor: theme.colors.darkTint10,
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 250,
  },
  textColor: {
    color: theme.colors.darkTint4,
  },
  ratingsHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const memoizedComponent = React.memo(CollapsibleSection);
export { memoizedComponent as CollapsibleSection };
