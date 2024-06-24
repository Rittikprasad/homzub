import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, StyleProp } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { OnFocusCallback } from '@homzhub/common/src/components/atoms/OnFocusCallback';
import { Label, Text, TextFieldType, TextSizeType } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  sectionTitle: string;
  sectionIcon: string;
  rightText?: string;
  rightTextColor?: string;
  rightIcon?: string;
  rightIconColor?: string;
  rightIconSize?: number;
  children: React.ReactElement;
  containerStyle?: ViewStyle;
  iconSize?: number;
  callback?: any;
  isAsync?: boolean;
  onPressRightContent?: () => void;
  rightTextType?: TextFieldType;
  rightTextSize?: TextSizeType;
  headerContainerStyle?: StyleProp<ViewStyle>;
  showSectionHeader?: boolean;
}

const SectionContainer = (props: IProps): React.ReactElement => {
  const {
    sectionTitle,
    sectionIcon,
    rightText,
    children,
    containerStyle,
    rightTextColor,
    iconSize = 22,
    callback,
    isAsync,
    rightIcon,
    rightIconSize = 22,
    rightIconColor = theme.colors.primaryColor,
    onPressRightContent,
    rightTextType,
    rightTextSize = 'small',
    headerContainerStyle,
    showSectionHeader = true,
  } = props;
  let TextField = Text;

  if (rightTextType === 'label') {
    TextField = Label;
  }
  if (!showSectionHeader) return <>{children}</>;
  return (
    <View style={[containerStyle && containerStyle]}>
      {callback && <OnFocusCallback isAsync={Boolean(isAsync)} callback={callback} />}
      <View style={[styles.headerHolder, headerContainerStyle]}>
        <View style={styles.header}>
          <Icon style={styles.icon} name={sectionIcon} size={iconSize} />
          <Text type="small" textType="semiBold">
            {sectionTitle}
          </Text>
        </View>
        <TouchableOpacity disabled={!onPressRightContent} onPress={onPressRightContent} style={styles.rightContainer}>
          {!!rightIcon && <Icon name={rightIcon} size={rightIconSize} color={rightIconColor} style={styles.icon} />}
          {!!rightText && (
            <TextField
              type={rightTextSize}
              textType="semiBold"
              style={{ ...styles.rightText, color: rightTextColor || undefined }}
            >
              {rightText}
            </TextField>
          )}
        </TouchableOpacity>
      </View>
      <Divider />
      {children}
    </View>
  );
};

export default SectionContainer;

const styles = StyleSheet.create({
  headerHolder: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginEnd: 12,
  },
  rightText: {
    marginRight: 16,
  },
});
