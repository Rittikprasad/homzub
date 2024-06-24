import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';
import { FontWeightType, TextFieldType, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { WithFieldError } from '@homzhub/common/src/components/molecules/WithFieldError';

interface ITransactionProp {
  label: string;
  name: string;
  options: IDropdownOption[];
  formProps: FormikProps<any>;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
  textType?: TextFieldType;
  textSize?: TextSizeType;
  fontType?: FontWeightType;
  rightNode?: React.ReactElement;
}
export const TransactionField = (props: ITransactionProp): React.ReactElement => {
  const { label, textType, textSize = 'regular', fontType, rightNode, options, formProps, name } = props;
  const { t } = useTranslation();
  return (
    <WithFieldError>
      <View style={styles.rowView}>
        <Typography size={textSize} fontWeight={fontType} variant={textType}>
          {label}
        </Typography>
        {rightNode}
      </View>
      {options.length ? (
        <FormDropdown
          name={name}
          placeholder={t('assetFinancial:addBankAccount')}
          options={options}
          formProps={formProps}
          listHeight={300}
        />
      ) : (
        <View />
      )}
    </WithFieldError>
  );
};

const styles = StyleSheet.create({
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
});
