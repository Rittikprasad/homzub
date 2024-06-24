import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import Icon from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { FontWeightType, TextFieldType, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';

interface IProps {
  text: string;
  value?: string;
  icon?: string;
  prefixIcon?: string;
  iconColor?: string;
  prefixIconColor?: string;
  iconSize?: number;
  textSize?: TextSizeType;
  fontWeight?: FontWeightType;
  variant?: TextFieldType;
  containerStyle?: StyleProp<ViewStyle>;
  subContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPrefixIcon?: () => void;
  onIcon?: () => void;
}

const TextWithIcon = (props: IProps): React.ReactElement => {
  const {
    text,
    icon,
    value,
    textSize = 'regular',
    variant = 'text',
    fontWeight = 'regular',
    iconSize = 20,
    iconColor = theme.colors.blue,
    containerStyle,
    textStyle,
    subContainerStyle,
    prefixIcon,
    prefixIconColor,
    onPrefixIcon,
    onIcon,
  } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      {!!prefixIcon && (
        <Icon
          name={prefixIcon}
          color={prefixIconColor}
          size={iconSize}
          style={styles.prefixIcon}
          onPress={onPrefixIcon}
        />
      )}
      <View style={[styles.container, subContainerStyle]}>
        <Typography size={textSize} variant={variant} fontWeight={fontWeight} style={[styles.textStyle, textStyle]}>
          {text}
        </Typography>
        {!!value && (
          <Typography size={textSize} variant={variant} fontWeight="semiBold" style={[styles.textStyle, textStyle]}>
            {value}
          </Typography>
        )}
      </View>
      {!!icon && <Icon name={icon} color={iconColor} size={iconSize} onPress={onIcon} />}
    </View>
  );
};

export default TextWithIcon;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    color: theme.colors.darkTint3,
  },
  prefixIcon: {
    alignSelf: 'flex-start',
    marginEnd: 10,
  },
});
