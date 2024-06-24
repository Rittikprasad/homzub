import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import RadioItem from '@homzhub/common/src/components/atoms/RadioItem';
import { FontWeightType, TextFieldType, TextSizeType, Label } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { ICardProp } from '@homzhub/common/src/components/molecules/DetailCard';
import { WithFieldError } from '@homzhub/common/src/components/molecules/WithFieldError';

interface ITransactionProp {
  label: string;
  name: string;
  options: ICardProp[];
  formProps: FormikProps<any>;
  onChange?: (value?: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
  textType?: TextFieldType;
  textSize?: TextSizeType;
  fontType?: FontWeightType;
  rightNode?: React.ReactElement;
}

export const TransactionField = (props: ITransactionProp): React.ReactElement => {
  const {
    label,
    options,
    textType = 'label',
    textSize = 'regular',
    fontType,
    rightNode,
    placeholder,
    name,
    isDisabled = false,
    formProps: { setFieldValue, setFieldTouched, values, errors },
  } = props;
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  const onSelectItem = (value: string): void => {
    setIsVisible(false);
    if (value === values[name]) {
      setFieldValue(name, '');
      return;
    }
    setFieldValue(name, value);
    setFieldTouched(name);
  };

  const renderItem = ({ item }: { item: ICardProp }): React.ReactElement => {
    const isCheck = values[name] === item.value;
    return <RadioItem item={item} isCheck={isCheck} onItemSelect={onSelectItem} />;
  };

  const itemSeparator = (): React.ReactElement => {
    return <Divider containerStyles={styles.divider} />;
  };

  const emptyContent = (): React.ReactElement => <EmptyState containerStyle={styles.emptyContent} />;

  const value = options.filter((item) => item.value === values[name])[0];
  const color = isDisabled ? theme.colors.disabled : theme.colors.darkTint7;
  return (
    <WithFieldError error={errors[name]}>
      <View style={styles.rowView}>
        <Typography size={textSize} fontWeight={fontType} variant={textType}>
          {label}
        </Typography>
        {rightNode}
      </View>
      <TouchableOpacity
        style={[styles.field, isDisabled && styles.disabled]}
        disabled={isDisabled}
        onPress={(): void => setIsVisible(true)}
      >
        <Label>{value ? value.selectedValue : placeholder}</Label>
        <Icon name={icons.downArrowFilled} size={16} color={color} />
      </TouchableOpacity>
      <BottomSheet
        isAlwaysVisible
        headerTitle={t('property:selectBankAccount')}
        visible={isVisible}
        onCloseSheet={(): void => setIsVisible(false)}
        sheetHeight={350}
      >
        <FlatList
          data={options}
          ListEmptyComponent={emptyContent}
          renderItem={renderItem}
          ItemSeparatorComponent={itemSeparator}
        />
      </BottomSheet>
    </WithFieldError>
  );
};

const styles = StyleSheet.create({
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 6,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    justifyContent: 'space-between',
    borderRadius: 4,
    borderColor: theme.colors.disabled,
  },
  disabled: {
    opacity: 0.5,
  },
  divider: {
    margin: 16,
    borderColor: theme.colors.background,
  },
  emptyContent: {
    marginTop: 25,
  },
});
