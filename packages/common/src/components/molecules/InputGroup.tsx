import React, { useEffect, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputEndEditingEventData,
  View,
  ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { WithFieldError } from '@homzhub/common/src/components/molecules/WithFieldError';

interface IInputGroupProps {
  data: string[];
  updateData: (values: string[]) => void;
  maxLimit?: number;
  label?: string;
  buttonLabel?: string;
  placeholder?: string;
  isEmailField?: boolean;
  updateError?: (isError: boolean) => void;
  inputContainer?: StyleProp<ViewStyle>;
  textInputContainerDeviceStyle?: StyleProp<ViewStyle>;
  textInputDeviceStyle?: StyleProp<ViewStyle>;
  addButtonDeviceStyle?: StyleProp<ViewStyle>;
}

const InputGroup = (props: IInputGroupProps): React.ReactElement => {
  const { t } = useTranslation();
  const {
    inputContainer,
    data,
    updateData,
    textInputContainerDeviceStyle,
    textInputDeviceStyle,
    maxLimit = 5,
    addButtonDeviceStyle,
    label,
    isEmailField = false,
    buttonLabel = t('add'),
    placeholder = t('property:highlightPlaceholder'),
    updateError,
  } = props;
  const [inputValues, setValues] = useState<string[]>([]);
  const [errorIndex, setErrorIndex] = useState<number>(-1);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setValues(data);
  }, []);

  const handleTextChange = (text: string, index: number): void => {
    const newData: string[] = [...inputValues];
    newData[index] = text;
    onSetData(newData);
  };

  const handleNext = (): void => {
    onSetData([...inputValues, '']);
  };

  const onPressCross = (index: number): void => {
    if (inputValues[index]) {
      const newData: string[] = inputValues;
      newData[index] = '';
      onSetData(newData);
    } else {
      onSetData(inputValues.slice(0, -1));
    }
  };

  const onEndEditing = (event: NativeSyntheticEvent<TextInputEndEditingEventData>, index: number): void => {
    const { text } = event.nativeEvent;
    if (isEmailField && !FormUtils.validateEmail(text)) {
      setErrorIndex(index);
      setError(t('landing:emailValidations'));
      if (updateError) {
        updateError(true);
      }
    }
    updateData(inputValues);
  };

  const onSetData = (values: string[]): void => {
    setValues(values);
    setError('');
    setErrorIndex(-1);
    if (updateError) {
      updateError(false);
    }
  };

  return (
    <>
      <View style={[styles.container, inputContainer]}>
        {!!label && (
          <Label type="large" style={styles.label}>
            {label}
          </Label>
        )}
        {inputValues.map((item, index) => {
          const isError = errorIndex === index;
          return (
            <WithFieldError key={index} error={isError ? error : ''} labelStyle={styles.errorLabel}>
              <View
                style={[
                  styles.textInputContainer,
                  textInputContainerDeviceStyle,
                  styles.textInputWrapper,
                  textInputDeviceStyle,
                  isError && styles.errorStyle,
                ]}
              >
                <TextInput
                  placeholder={placeholder}
                  autoCorrect={false}
                  autoCapitalize="words"
                  numberOfLines={1}
                  value={item}
                  onEndEditing={(e): void => onEndEditing(e, index)}
                  onChangeText={(text): void => handleTextChange(text, index)}
                  style={styles.textInput}
                />
                {inputValues.length > 1 && index > 0 && (
                  <Button
                    type="primary"
                    icon={icons.circularCrossFilled}
                    iconSize={20}
                    iconColor={theme.colors.darkTint9}
                    containerStyle={styles.iconButton}
                    onPress={(): void => onPressCross(index)}
                    testID="btnCross"
                  />
                )}
              </View>
            </WithFieldError>
          );
        })}
      </View>
      {inputValues.length !== maxLimit && (
        <View style={[styles.addButtonWrapper, addButtonDeviceStyle]}>
          <Button
            type="secondary"
            title={buttonLabel}
            containerStyle={[styles.addButton, textInputDeviceStyle]}
            onPress={handleNext}
          />
        </View>
      )}
    </>
  );
};

export default InputGroup;

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 12,
    marginVertical: 8,
    borderColor: theme.colors.darkTint10,
  },
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
    flexWrap: 'wrap',
  },
  iconButton: {
    flex: 0,
    backgroundColor: theme.colors.secondaryColor,
    marginRight: 14,
  },
  textInputWrapper: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  textInput: {
    width: '90%',
  },
  addButtonWrapper: {
    flex: 0,
    flexDirection: 'row',
  },
  addButton: {
    borderStyle: 'dashed',
  },
  label: {
    color: theme.colors.darkTint3,
  },
  errorStyle: {
    borderColor: theme.colors.error,
  },
  errorLabel: {
    marginTop: 0,
  },
});
