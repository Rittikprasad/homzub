import React, { useEffect, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputChangeEventData,
  View,
  StyleSheet,
  TextInputEndEditingEventData,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { WithFieldError } from '@homzhub/common/src/components/molecules/WithFieldError';

interface IProps {
  data?: string[];
  onSetValue: (values: string[]) => void;
  setValueError?: (isError: boolean) => void;
  isDisabled?: boolean;
  errorText?: string;
  label?: string;
  valueLimit?: number;
  placeholder?: string;
  isEmailField?: boolean;
  chipColor?: string;
  totalChips?: number;
}

const ChipField = (props: IProps): React.ReactElement => {
  const [chips, setChips] = useState<string[]>([]);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const {
    data,
    onSetValue,
    setValueError,
    isDisabled = false,
    errorText,
    label = t('assetFinancial:separatedByComma'),
    placeholder = t('assetFinancial:enterEmails'),
    isEmailField = false,
    chipColor = theme.colors.darkTint4,
    valueLimit,
    totalChips = 10,
  } = props;

  useEffect(() => {
    if (data) {
      setChips(data);
    }
  }, [data]);

  const handleChange = (event: NativeSyntheticEvent<TextInputChangeEventData>): void => {
    const { text } = event.nativeEvent;
    if (text.includes(',')) {
      event.preventDefault();
      const email = value.trim();
      if (email) {
        onUpdate(email);
      }

      return;
    }

    if (setValueError) {
      setValueError(false);
    }
    setError('');
    setValue(text);
  };

  const onEndEditing = (event: NativeSyntheticEvent<TextInputEndEditingEventData>): void => {
    const { text } = event.nativeEvent;
    if (text) {
      onUpdate(text);
    } else {
      setError('');
    }
  };

  const onUpdate = (text: string): void => {
    if (isEmailField && !FormUtils.validateEmail(text)) {
      if (setValueError) {
        setValueError(true);
      }
      setError('landing:emailValidations');
      return;
    }

    if (valueLimit && text.length > valueLimit) {
      if (setValueError) {
        setValueError(true);
      }
      setError(t('serviceTickets:categoryLimit', { limit: valueLimit }));
      return;
    }

    if (!chips.includes(text)) {
      const updated: string[] = [...chips, text];
      setChips(updated);
      onSetValue(updated);
      setValue('');
      setError('');
      if (setValueError) {
        setValueError(false);
      }
    } else {
      if (setValueError) {
        setValueError(true);
      }
      if (isEmailField) {
        setError('auth:duplicateEmail');
      
      } else {
        setError('common:duplicateValue');
      }
    }
  };

  const handleRemove = (email: string): void => {
    if (isDisabled) return;
    setChips(chips.filter((item) => item !== email));
    onSetValue(chips.filter((item) => item !== email));
    setError('');
    if (setValueError) {
      setValueError(false);
    }
  };

  const isError = !!errorText || !!error;

  return (
    <View style={styles.container}>
      <WithFieldError error={t(errorText || error)}>
        <Label type="large" style={[styles.label, isError && styles.errorLabel]}>
          {label}
        </Label>
        <View style={[styles.itemContainer, isError && styles.errorContainer]}>
          {chips.length > 0 && (
            <View style={styles.content}>
              {chips.map((item, index) => (
                <View key={index} style={styles.item}>
                  <Label type="large" style={{ ...styles.itemLabel, color: chipColor }}>
                    {item}
                  </Label>
                  <Icon
                    name={icons.circularCrossFilled}
                    size={16}
                    color={isDisabled ? theme.colors.disabled : chipColor}
                    onPress={(): void => handleRemove(item)}
                  />
                </View>
              ))}
            </View>
          )}
          {chips.length < totalChips && (
            <TextInput
              value={value}
              onChange={handleChange}
              autoFocus={chips.length > 0}
              onEndEditing={onEndEditing}
              // onBlur={onEndEditing}
              editable={!isDisabled}
              style={isDisabled && styles.disabled}
              placeholder={placeholder}
            />
          )}
        </View>
      </WithFieldError>
    </View>
  );
};

export default ChipField;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    color: theme.colors.darkTint4,
    marginBottom: 8,
  },
  errorLabel: {
    color: theme.colors.error,
  },
  itemContainer: {
    borderWidth: 1,
    padding: 12,
    borderColor: theme.colors.disabled,
    borderRadius: 4,
  },
  errorContainer: {
    borderColor: theme.colors.error,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.lightGrayishBlue,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  itemLabel: {
    marginRight: 6,
  },
  disabled: {
    opacity: 0.5,
  },
});
