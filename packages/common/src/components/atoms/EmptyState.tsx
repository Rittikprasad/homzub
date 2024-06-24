import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, IButtonProps } from '@homzhub/common/src/components/atoms/Button';
import { Text, Label, TextFieldType } from '@homzhub/common/src/components/atoms/Text';

type TextSizeType = 'small' | 'regular' | 'large';
interface IProps {
  icon?: string;
  title?: string;
  iconSize?: number;
  subTitle?: string;
  isIconRequired?: boolean;
  buttonProps?: IButtonProps;
  containerStyle?: StyleProp<ViewStyle>;
  textType?: TextSizeType;
  fieldType?: TextFieldType;
  textStyle?: StyleProp<TextStyle>;
}

export const EmptyState = (props: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const {
    isIconRequired = true,
    icon = icons.search,
    iconSize = 30,
    title = t('common:noResultsFound'),
    subTitle,
    buttonProps,
    containerStyle,
    textType = 'small',
    textStyle,
    fieldType = 'text',
  } = props;
  const TextField = fieldType === 'label' ? Label : Text;
  return (
    <View style={[styles.noDataContainer, containerStyle]}>
      {isIconRequired && <Icon name={icon} size={iconSize} color={theme.colors.disabledSearch} />}
      <TextField type={textType} textType="semiBold" style={[styles.noResultsFound, textStyle]}>
        {title}
      </TextField>
      {!!subTitle && (
        <Label type="large" textType="semiBold" style={styles.subTitle}>
          {subTitle}
        </Label>
      )}
      {buttonProps && <Button {...buttonProps} />}
    </View>
  );
};

const styles = StyleSheet.create({
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
    backgroundColor: theme.colors.white,
  },
  noResultsFound: {
    marginVertical: 16,
    textAlign: 'center',
    color: theme.colors.darkTint6,
  },
  subTitle: {
    textAlign: 'center',
    color: theme.colors.darkTint8,
  },
});
