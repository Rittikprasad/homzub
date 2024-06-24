import React, { ReactElement } from 'react';
import { Text as RNText, TextProps } from 'react-native';
import {
  FontWeightType,
  Label,
  Text,
  TextFieldType,
  TextSizeType,
  Title,
} from '@homzhub/common/src/components/atoms/Text';

export interface ITypographyProps extends TextProps {
  children?: string | React.ReactNode;
  size: TextSizeType;
  fontWeight?: FontWeightType;
  variant?: TextFieldType;
  testID?: string;
  maxLength?: number;
}

export const Typography = ({
  variant,
  size,
  style,
  children,
  fontWeight,
  testID,
  maxLength,
  ...props
}: ITypographyProps): ReactElement<RNText> => {
  let TextField = Text;

  if (variant === 'label') {
    TextField = Label;
  }
  if (variant === 'title') {
    TextField = Title;
  }

  return (
    <TextField type={size} textType={fontWeight} style={style} {...props}>
      {children ?? ''}
    </TextField>
  );
};
