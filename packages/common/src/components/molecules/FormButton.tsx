import React from 'react';
import { FormikProps } from 'formik';
import { Button, IButtonProps } from '@homzhub/common/src/components/atoms/Button';

export interface IFormButtonProps extends IButtonProps {
  formProps: FormikProps<any>;
  disabled?: boolean;
}

export const FormButton = (props: IFormButtonProps): React.ReactElement => {
  const { disabled, formProps, containerStyle, ...buttonProps } = props;
  const isDisabled = !formProps.isValid;

  return <Button disabled={disabled || isDisabled} {...buttonProps} containerStyle={containerStyle} />;
};
