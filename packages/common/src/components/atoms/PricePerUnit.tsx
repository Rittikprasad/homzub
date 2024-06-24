import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { CurrencyUtils } from '@homzhub/common/src/utils/CurrencyUtils';
import { FontWeightType, Label, Text, TextFieldType, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { Currency } from '@homzhub/common/src/domain/models/Currency';

interface IProps {
  price: number;
  prefixText?: string;
  unit?: string;
  currency: Currency;
  priceTransformation?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  textSizeType?: TextSizeType;
  textFieldType?: TextFieldType;
  textFontWeight?: FontWeightType;
  textStyle?: StyleProp<TextStyle>;
}

const PricePerUnit = (props: IProps): React.ReactElement => {
  const {
    price,
    prefixText,
    unit = '',
    currency,
    priceTransformation = true,
    labelStyle,
    textStyle,
    textSizeType = 'regular',
    textFontWeight = 'semiBold',
    textFieldType = 'text',
  } = props;

  const transformedPrice = priceTransformation
    ? CurrencyUtils.getCurrency(currency.currencyCode ?? currency, price)
    : price;
  const priceWithCurrency = `${currency.currencySymbol} ${transformedPrice}`;
  const TextField = textFieldType === 'label' ? Label : Text;

  return (
    <TextField
      type={textSizeType}
      textType={textFontWeight}
      style={textStyle}
      minimumFontScale={0.5}
      adjustsFontSizeToFit
    >
      {prefixText ? `${prefixText} ${priceWithCurrency}` : priceWithCurrency}
      {unit.length > 0 && (
        <Label type="large" textType="regular" style={labelStyle} minimumFontScale={0.5} adjustsFontSizeToFit>
          / {unit}
        </Label>
      )}
    </TextField>
  );
};

const memoizedComponent = React.memo(PricePerUnit);
export { memoizedComponent as PricePerUnit };
