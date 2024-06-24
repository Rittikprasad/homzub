import React, { useLayoutEffect, useRef, useState } from 'react';
import { StyleProp, StyleSheet, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';

interface IProps {
  label?: string;
  value: string;
  placeholder: string;
  helpText?: string;
  isCountRequired?: boolean;
  onMessageChange?: (text: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  textAreaStyle?: StyleProp<ViewStyle>;
  wordCountLimit?: number;
  inputContainerStyle?: StyleProp<ViewStyle>;
  labelType?: TextSizeType;
  isDisabled?: boolean;
}

export const TextArea = (props: IProps): React.ReactElement => {
  const [autoheight, setAutoHeight] = useState<string | number | undefined>(undefined);
  const ref: React.RefObject<TextInput> = useRef(null);
  const {
    label,
    placeholder,
    containerStyle = {},
    inputContainerStyle = {},
    onMessageChange,
    value,
    wordCountLimit = 250,
    helpText,
    textAreaStyle,
    isCountRequired = true,
    labelType = 'large',
    isDisabled = false,
  } = props;
  const { t } = useTranslation();

  const onPressBox = (): void => {
    if (isDisabled) return;
    if (ref.current) {
      ref.current.focus();
    }
  };

  const textAreaStyleProp = StyleSheet.flatten(textAreaStyle);
  const inputContainerStyleProp = StyleSheet.flatten(inputContainerStyle);
  const textAreaStylePropHeight = textAreaStyleProp?.height || inputContainerStyleProp?.height || undefined;
  useLayoutEffect(() => {
    if (textAreaStylePropHeight) {
      setAutoHeight(textAreaStylePropHeight);
    }
  }, []);

  const wordCount = value.length === 0 ? wordCountLimit : wordCountLimit - value.length;
  return (
    <View style={containerStyle}>
      <View style={styles.labelView}>
        <Label type={labelType} style={styles.labelStyle}>
          {label}
        </Label>
        {!!helpText && (
          <Label type="regular" style={styles.labelHelper}>
            {helpText}
          </Label>
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.textAreaContainer,
          textAreaStyle,
          autoheight !== undefined && { height: autoheight },
          isDisabled && styles.disabled,
        ]}
        onPress={onPressBox}
        activeOpacity={1}
        disabled={isDisabled}
      >
        <TextInput
          ref={ref}
          autoCorrect={false}
          style={[styles.textArea, inputContainerStyle, autoheight !== undefined && { height: autoheight }]}
          placeholder={placeholder}
          maxLength={250}
          multiline
          numberOfLines={4}
          value={value}
          editable={!isDisabled}
          onChangeText={onMessageChange}
        />
      </TouchableOpacity>
      {isCountRequired && (
        <Label type="small" style={[styles.labelStyle, styles.helpText]}>
          {t('charactersRemaining', { wordCount })}
        </Label>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    marginVertical: 6,
    color: theme.colors.darkTint3,
  },
  textAreaContainer: {
    height: 150,
    borderColor: theme.colors.disabled,
    borderWidth: 1,
    padding: PlatformUtils.isWeb() ? 0 : 5,
  },
  textArea: {
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    height: 150,
  },
  helpText: {
    paddingVertical: 6,
  },
  labelView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelHelper: {
    color: theme.colors.darkTint3,
  },
  disabled: {
    opacity: 0.5,
  },
});
