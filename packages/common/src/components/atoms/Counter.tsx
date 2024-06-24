import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle, TextInput, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface ITitle {
  title: string;
  titleStyle?: TextStyle;
  id?: number;
}

export interface ICounterProps {
  defaultValue: number;
  name?: ITitle;
  svgImage?: string;
  onValueChange: (count: number, id?: number) => void;
  maxCount?: number;
  minCount?: number;
  containerStyles?: StyleProp<ViewStyle>;
  testID?: string;
  disabled?: boolean;
}

export const Counter = (props: ICounterProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  const { onValueChange, defaultValue, name, svgImage, maxCount = 10, minCount = 0, containerStyles, disabled } = props;
  const [count, setCount] = useState(defaultValue);
  const [previousCount, setPreviousCount] = useState(defaultValue);

  useEffect(() => {
    onValueChange(count, name?.id);
  }, [count]);

  const isDecDisabled = disabled || count <= minCount;
  const isIncDisabled = disabled || count >= maxCount;

  const incrementCount = (): void => {
    if (count < maxCount) {
      setCount((prev) => prev + 1);
      return;
    }
    AlertHelper.error({ message: t('maxCount', { count: maxCount }) });
  };

  const decrementCount = (): void => {
    if (count > minCount) {
      setCount((prev) => prev - 1);
      return;
    }
    AlertHelper.error({ message: t('minCount', { count: minCount }) });
  };

  const onCountChange = (value: string): void => {
    if (Number(value) > maxCount) {
      AlertHelper.error({ message: t('maxCount', { count: maxCount }) });
      setCount(Number(defaultValue));
      return;
    }
    if (Number(value) < 0) {
      AlertHelper.error({ message: t('minCount') });
      return;
    }
    setPreviousCount(Number(value));
    setCount(Number(value));
  };

  const onEndEditing = (): void => {
    if (previousCount) {
      setCount(previousCount);
      return;
    }

    if (count === 0 || count > maxCount) {
      setCount(defaultValue);
    }
  };

  const onFocus = (): void => {
    setPreviousCount(count);
    setCount(0);
  };

  return (
    <View style={[styles.rowStyle, containerStyles]}>
      <View style={styles.imageContainer}>
        {svgImage && PlatformUtils.isMobile() ? (
          <SVGUri height={24} width={24} uri={svgImage} style={styles.svgStyle} />
        ) : (
          svgImage && <Image source={{ uri: svgImage }} style={styles.imageStyle} />
        )}
        {name && (
          <Text style={[styles.textStyle, name.titleStyle]} type="small">
            {name.title}
          </Text>
        )}
      </View>
      <View style={[styles.counterContainer, styles.rowStyle]}>
        <View style={[customStyles.iconStyle(isDecDisabled), styles.iconContainer]}>
          <Icon
            name={icons.minus}
            color={isDecDisabled ? theme.colors.disabled : theme.colors.primaryColor}
            size={20}
            onPress={disabled ? undefined : decrementCount}
          />
        </View>
        <TextInput
          style={[customStyles.textInputStyle(isDecDisabled, isIncDisabled), styles.counterValue]}
          keyboardType="number-pad"
          maxLength={2}
          defaultValue={defaultValue.toString()}
          value={count.toString()}
          onChangeText={onCountChange}
          onEndEditing={onEndEditing}
          onFocus={onFocus}
        />
        <View style={[customStyles.iconStyle(isIncDisabled), styles.iconContainer]}>
          <Icon
            name={icons.plus}
            color={isIncDisabled ? theme.colors.disabled : theme.colors.primaryColor}
            size={20}
            onPress={disabled ? undefined : incrementCount}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterContainer: {
    borderColor: theme.colors.darkTint10,
    borderWidth: 1,
    borderRadius: 4,
    width: 104,
    padding: 4,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: 2,
  },
  svgStyle: {
    marginEnd: 12,
  },
  textStyle: {
    width: PlatformUtils.isMobile() ? 100 : '100%',
  },
  counterValue: {
    textAlign: 'center',
    padding: 0,
    width: 50,
  },
  imageStyle: {
    marginRight: 12,
    width: 24,
    height: 24,
  },
});

const customStyles = {
  iconStyle: (isDecDisabled: boolean): StyleProp<ViewStyle> => ({
    backgroundColor: isDecDisabled ? theme.colors.disabledOpacity : theme.colors.activeOpacity,
  }),
  textInputStyle: (isDecDisabled: boolean, isIncDisabled: boolean): StyleProp<TextStyle> => ({
    color: isDecDisabled || isIncDisabled ? theme.colors.darkTint5 : theme.colors.primaryColor,
  }),
};
