import React, { useEffect, useState, useRef } from 'react';
import { StyleProp, StyleSheet, TextInput, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';

export interface IProps {
  onChange: (isSelected: boolean, text: string) => void;
  selected?: boolean;
  textValue?: string;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const InputWithCheckbox = (props: IProps): React.ReactElement => {
  const { onChange, selected = false, textValue = '', placeholder, containerStyle = {} } = props;
  const [isSelected, setIsSelected] = useState(selected);
  const [text, setText] = useState(textValue);
  const ref: React.RefObject<TextInput> = useRef(null);

  useEffect(() => {
    onChange(isSelected, text);
  }, [isSelected, text]);

  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.focus();
    }
  }, [isSelected]);

  const onCheckboxToggle = (): void => {
    setIsSelected((prev) => !prev);
  };

  const onFocus = (): void => setIsSelected(true);

  return (
    <TouchableOpacity onPress={onCheckboxToggle} style={[styles.inputWithCheckbox, containerStyle]}>
      <RNCheckbox containerStyle={styles.checkboxStyle} onToggle={onCheckboxToggle} selected={isSelected} />
      <TextInput
        editable
        ref={ref}
        value={text}
        style={styles.inputStyle}
        placeholderTextColor={theme.colors.disabled}
        onChangeText={setText}
        underlineColorAndroid="transparent"
        placeholder={placeholder}
        onFocus={onFocus}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputWithCheckbox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.disabled,
    marginTop: 8,
  },
  checkboxStyle: {
    padding: 10,
  },
  inputStyle: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    paddingLeft: 0,
    color: theme.colors.dark,
  },
});
