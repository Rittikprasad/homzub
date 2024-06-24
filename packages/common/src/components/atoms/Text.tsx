import React, { ReactElement } from 'react';
import { Text as RNText, StyleSheet, TextProps, StyleProp, TextStyle } from 'react-native';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';

type TextFieldType = 'label' | 'text' | 'title';
type TextSizeType = 'small' | 'regular' | 'large';
type FontWeightType = 'light' | 'regular' | 'semiBold' | 'bold' | 'extraBold';

interface IProps extends TextProps {
  children: string | React.ReactNode;
  type?: TextSizeType;
  textType?: FontWeightType;
  testID?: string;
  maxLength?: number;
}

export const fontFamilies = {
  english: {
    light: 'OpenSans-Light',
    regular: 'OpenSans-Regular',
    semiBold: 'OpenSans-SemiBold',
    bold: 'OpenSans-Bold',
    extraBold: 'OpenSans-ExtraBold',
  },
};

const fontLineHeights = {
  label: {
    small: 15,
    regular: 18,
    large: 22,
  },
  text: {
    small: 20,
    regular: 30,
    large: 26,
  },
  title: {
    regular: 41,
    large: 54,
  },
};

const fontSelection = {
  light: {
    fontFamily: I18nService.select<string>({
      rtl: fontFamilies.english.light,
      ltr: fontFamilies.english.light,
    }),
    ...I18nService.select<object>({
      rtl: {
        fontWeight: '300',
      },
      ltr: {
        fontWeight: '300',
      },
    }),
  },
  regular: {
    fontFamily: I18nService.select<string>({
      rtl: fontFamilies.english.regular,
      ltr: fontFamilies.english.regular,
    }),
    ...I18nService.select<object>({
      rtl: {
        fontWeight: '400',
      },
      ltr: {
        fontWeight: '400',
      },
    }),
  },
  semiBold: {
    fontFamily: I18nService.select<string>({
      rtl: fontFamilies.english.semiBold,
      ltr: fontFamilies.english.semiBold,
    }),
    ...I18nService.select<object>({
      rtl: {
        fontWeight: '600',
      },
      ltr: {
        fontWeight: '600',
      },
    }),
  },
  bold: {
    fontFamily: I18nService.select<string>({
      rtl: fontFamilies.english.bold,
      ltr: fontFamilies.english.bold,
    }),
    ...I18nService.select<object>({
      rtl: {
        fontWeight: '700',
      },
      ltr: {
        fontWeight: '700',
      },
    }),
  },
  extraBold: {
    fontFamily: I18nService.select<string>({
      rtl: fontFamilies.english.extraBold,
      ltr: fontFamilies.english.extraBold,
    }),
    ...I18nService.select<object>({
      rtl: {
        fontWeight: '800',
      },
      ltr: {
        fontWeight: '800',
      },
    }),
  },
};

const Label = ({
  type = 'regular',
  style,
  children,
  textType,
  maxLength,
  testID,
  ...props
}: IProps): ReactElement<RNText> => {
  let defaultStyle: object = {};
  const fontStyle: StyleProp<TextStyle> = fontSelection[textType ?? 'regular'];
  switch (type) {
    case 'large':
      defaultStyle = styles.labelLarge;
      break;
    case 'regular':
      defaultStyle = styles.labelRegular;
      break;
    case 'small':
    default:
      defaultStyle = styles.labelSmall;
      break;
  }
  const slicedText =
    maxLength && children && children.toString().length > maxLength
      ? `${children.toString().substring(0, maxLength)}...`
      : children;

  return (
    <RNText style={[defaultStyle, fontStyle, style]} {...props} testID={testID}>
      {slicedText || children}
    </RNText>
  );
};

const Text = ({
  type = 'regular',
  style,
  children,
  textType,
  testID,
  maxLength,
  ...props
}: IProps): ReactElement<RNText> => {
  let defaultStyle: object = {};
  const fontStyle: StyleProp<TextStyle> = fontSelection[textType ?? 'regular'];
  switch (type) {
    case 'regular':
      defaultStyle = styles.textRegular;
      break;
    case 'large':
      defaultStyle = styles.textLarge;
      break;
    case 'small':
    default:
      defaultStyle = styles.textSmall;
      break;
  }
  const slicedText =
    maxLength && children && children.toString().length > maxLength
      ? `${children.toString().substring(0, maxLength)}...`
      : children;

  return (
    <RNText style={[defaultStyle, fontStyle, style]} {...props} testID={testID}>
      {slicedText || children}
    </RNText>
  );
};

const Title = ({
  type = 'regular',
  style,
  children,
  textType,
  testID,
  maxLength,
  ...props
}: IProps): ReactElement<RNText> => {
  let defaultStyle: object = {};
  const fontStyle: StyleProp<TextStyle> = fontSelection[textType ?? 'regular'];
  switch (type) {
    case 'regular':
      defaultStyle = styles.titleRegular;
      break;
    case 'large':
      defaultStyle = styles.titleLarge;
      break;
    case 'small':
    default:
      defaultStyle = styles.titleSmall;
      break;
  }
  const slicedText =
    maxLength && children && children.toString().length > maxLength
      ? `${children.toString().substring(0, maxLength)}...`
      : children;

  return (
    <RNText style={[defaultStyle, fontStyle, style]} {...props} testID={testID}>
      {slicedText || children}
    </RNText>
  );
};

export { Label, Text, Title, fontLineHeights, TextFieldType, TextSizeType, FontWeightType };

const styles = StyleSheet.create({
  labelSmall: {
    fontSize: I18nService.select<number>({
      rtl: 10,
      ltr: 10,
    }),
    lineHeight: fontLineHeights.label.small,
    textAlign: 'left',
  },
  labelRegular: {
    fontSize: I18nService.select<number>({
      rtl: 12,
      ltr: 12,
    }),
    lineHeight: fontLineHeights.label.regular,
    textAlign: 'left',
  },
  labelLarge: {
    fontSize: I18nService.select<number>({
      rtl: 14,
      ltr: 14,
    }),
    lineHeight: fontLineHeights.label.large,
    textAlign: 'left',
  },
  textSmall: {
    fontSize: I18nService.select<number>({
      rtl: 16,
      ltr: 16,
    }),
    lineHeight: fontLineHeights.text.small,
    textAlign: 'left',
  },
  textRegular: {
    fontSize: I18nService.select<number>({
      rtl: 20,
      ltr: 20,
    }),
    lineHeight: fontLineHeights.text.regular,
    textAlign: 'left',
  },
  textLarge: {
    fontSize: I18nService.select<number>({
      rtl: 24,
      ltr: 24,
    }),
    lineHeight: fontLineHeights.text.large,
    textAlign: 'left',
  },
  titleSmall: {
    fontSize: I18nService.select<number>({
      rtl: 30,
      ltr: 30,
    }),
    lineHeight: fontLineHeights.title.regular,
    textAlign: 'left',
  },
  titleRegular: {
    fontSize: I18nService.select<number>({
      rtl: 32,
      ltr: 32,
    }),
    lineHeight: fontLineHeights.title.regular,
    textAlign: 'left',
  },
  titleLarge: {
    fontSize: I18nService.select<number>({
      rtl: 36,
      ltr: 36,
    }),
    lineHeight: fontLineHeights.title.regular,
    textAlign: 'left',
  },
});
