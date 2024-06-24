import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Hoverable } from '@homzhub/web/src/components/hoc/Hoverable';

export interface IPopupOptions {
  icon?: string;
  iconRight?: string;
  checked?: boolean;
  value?: string | number;
  label: string;
}

type TextSizeType = 'small' | 'regular' | 'large';

interface IProps<T extends IPopupOptions> {
  options: T[];
  onMenuOptionPress: (option: T) => void;
  from?: string;
  autoDetect?: () => void;
  labelType?: TextSizeType;
  itemStyle?: StyleProp<ViewStyle>;
}

const PopupMenuOptions = <T extends IPopupOptions>({
  options,
  onMenuOptionPress,
  from,
  autoDetect,
  labelType = 'large',
  itemStyle = {},
}: IProps<T>): React.ReactElement => {
  const { primaryColor, darkTint4 } = theme.colors;
  const { t } = useTranslation();

  return (
    <View style={styles.optionContainer}>
      {from && from === 'Search' && (
        <>
          <Button type="secondaryOutline" containerStyle={styles.buttonContainer} onPress={autoDetect}>
            <Icon name={icons.location} size={15} color={theme.colors.blue} />
            <Typography variant="label" size="regular" style={styles.buttonTitle}>
              {t('nearMe')}
            </Typography>
          </Button>
          <Label type="large" textType="semiBold" style={styles.label}>
            {t('searchResults')}
          </Label>
        </>
      )}
      {options.map((item) => (
        <Hoverable key={item.label}>
          {(isHovered: boolean): React.ReactNode => (
            <TouchableOpacity
              onPress={(): void => onMenuOptionPress(item)}
              style={[styles.option, isHovered && styles.activeOption, itemStyle]}
            >
              {item.icon && <Icon name={item.icon} color={isHovered ? primaryColor : darkTint4} style={styles.icon} />}
              <Label
                type={labelType}
                textType="semiBold"
                style={[styles.optionText, isHovered && styles.optionTextHovered]}
              >
                {item.label}
              </Label>
              {item.iconRight && (
                <Icon name={item.iconRight} color={isHovered ? primaryColor : darkTint4} style={styles.icon} />
              )}
            </TouchableOpacity>
          )}
        </Hoverable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    backgroundColor: theme.colors.white,
    paddingVertical: 8,
    maxHeight: 245,
    overflowY: 'auto',
  },
  option: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    marginRight: 8,
  },
  activeOption: {
    backgroundColor: theme.colors.background,
  },
  optionText: {
    color: theme.colors.darkTint4,
  },
  optionTextHovered: {
    color: theme.colors.primaryColor,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    marginLeft: 16,
  },
  buttonTitle: {
    color: theme.colors.blue,
    marginLeft: 8,
    paddingVertical: 4,
  },
  label: {
    margin: 16,
  },
});

export default PopupMenuOptions;
