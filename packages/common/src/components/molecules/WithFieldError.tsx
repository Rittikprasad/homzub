import React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { FormikErrors } from 'formik';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProps {
  children: string | React.ReactNode | null;
  error?: FormikErrors<any>[] | string | string[] | FormikErrors<any> | undefined;
  hideError?: boolean;
  labelStyle?: StyleProp<TextStyle>;
}

export const WithFieldError = (props: IProps): React.ReactElement => {
  const { children, error, hideError = false, labelStyle } = props;
  const hasError = !!error;
  return (
    <>
      {children}
      {hasError && !hideError && (
        <Label type="regular" style={[styles.error, labelStyle]}>
          {error}
        </Label>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  error: {
    color: theme.form.formErrorColor,
    marginTop: 3,
  },
});
