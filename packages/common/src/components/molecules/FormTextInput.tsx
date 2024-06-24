import React, { PureComponent, createRef, RefObject } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  TextStyle,
  TextInputProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
  Image,
} from 'react-native';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormikErrors, FormikProps } from 'formik';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { DisallowedInputCharacters } from '@homzhub/common/src/utils/FormUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { FontWeightType, Label, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { TextInputSuffix } from '@homzhub/common/src/components/atoms/TextInputSuffix';
import { WithFieldError } from '@homzhub/common/src/components/molecules/WithFieldError';
import { BottomSheetListView } from '@homzhub/mobile/src/components/molecules/BottomSheetListView';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';

type SupportedInputType = 'email' | 'password' | 'number' | 'phone' | 'default' | 'name' | 'decimal';

interface IStateProps {
  countries: Country[];
  defaultPhoneCode: string;
}

interface IDispatchProps {
  getCountries: () => void;
}

export interface IWebProps {
  fetchPhoneCodes: () => void;
  fetchFlag: () => React.ReactElement | null;
  inputPrefixText: string;
  phoneCodes: IDropdownOption[];
  isBottomSheetVisible: boolean;
  onCloseDropDownWeb: (selectedOption: IDropdownOption) => void;
}

export interface IFormTextInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  formProps: FormikProps<any>;
  inputType: SupportedInputType;
  labelTextType?: TextSizeType;
  name: string;
  label?: string;
  helpText?: string;
  hideError?: boolean;
  isMandatory?: boolean;
  inputPrefixText?: string;
  inputGroupPrefix?: React.ReactNode;
  inputGroupSuffix?: React.ReactNode;
  inputGroupSuffixText?: string;
  hidePasswordRevealer?: boolean;
  disallowedCharacters?: RegExp;
  phoneCodeKey?: string;
  onValueChange?: (text: string) => void;
  isTouched?: boolean;
  editable?: boolean;
  onIconPress?: () => void;
  phoneFieldDropdownText?: string;
  webGroupPrefix?: (params: IWebProps) => React.ReactElement;
  secondaryLabel?: React.ReactNode;
  fontWeightType?: FontWeightType;
  optionalText?: string;
  onPressOptional?: () => void;
  optionalStyle?: StyleProp<TextStyle>;
  extraError?: string;
}

interface IFormTextInputState {
  showCurrencySymbol: boolean;
  showPassword: boolean;
  isFocused: boolean;
  isBottomSheetVisible: boolean;
  phoneCodes: IDropdownOption[];
}

type Props = IStateProps & IDispatchProps & IFormTextInputProps;

// CONSTANTS
const PHONE_CODE = 'phoneCode';

class FormTextInput extends PureComponent<Props, IFormTextInputState> {
  public inputText: RefObject<RNTextInput> = createRef();

  public state = {
    showCurrencySymbol: false,
    showPassword: false,
    isFocused: false,
    isBottomSheetVisible: false,
    phoneCodes: [],
  };

  public componentDidMount = (): void => {
    const { formProps, inputType, phoneCodeKey = PHONE_CODE, defaultPhoneCode } = this.props;
    if (inputType !== 'phone' || formProps.values[phoneCodeKey]) {
      return;
    }
    this.fetchPhoneCodes();
    formProps.setFieldValue(phoneCodeKey, defaultPhoneCode);
  };

  public render(): React.ReactNode {
    const {
      name,
      label,
      placeholder,
      formProps,
      style = {},
      inputType,
      hidePasswordRevealer,
      inputPrefixText = '',
      inputGroupSuffixText = '',
      children,
      hideError,
      containerStyle = {},
      helpText,
      isMandatory = false,
      isTouched = true,
      editable = true,
      maxLength = 40,
      phoneFieldDropdownText = '',
      webGroupPrefix,
      secondaryLabel,
      fontWeightType,
      optionalText,
      labelTextType = 'regular',
      onPressOptional,
      optionalStyle,
      extraError,
      ...rest
    } = this.props;
    console.log({secondaryLabel})
    let { inputGroupSuffix, inputGroupPrefix } = this.props;
    const { values, setFieldTouched } = formProps;
    const { showPassword, isFocused, showCurrencySymbol, phoneCodes, isBottomSheetVisible } = this.state;
    const inputFieldStyles = {
      ...theme.form.input,
      // @ts-ignore
      ...style,
      ...(inputGroupSuffixText && { paddingRight: inputGroupSuffixText.length * 10 + 5 }),
    };
    let labelStyles = { ...theme.form.formLabel };
    let inputProps = {
      caretHidden: PlatformUtils.isWeb(),
      value: values[name],
      placeholder,
      placeholderTextColor: theme.form.placeholderColor,
      style: inputFieldStyles,
      autoCorrect: false,
      editable,
      maxLength,
      onChangeText: this.handleTextChange,
      onBlur: (): void => {
        setFieldTouched(name, isTouched);
        this.handleBlur();
      },
      onFocus: (): void => {
        this.handleFocus();
      },
      ...rest,
    };

    switch (inputType) {
      case 'email':
        inputProps = { ...inputProps, ...{ keyboardType: 'email-address', autoCapitalize: 'none' } };
        break;
      case 'number':
        inputProps = { ...inputProps, ...{ keyboardType: 'number-pad' } };
        if (
          inputPrefixText &&
          inputPrefixText.length > 0 &&
          (showCurrencySymbol || String(inputProps.value).length > 0)
        ) {
          inputGroupPrefix = (
            <View style={styles.currencyPrefix}>
              <Label type="regular" style={styles.currencyPrefixText}>
                {inputPrefixText}
              </Label>
            </View>
          );

          const prefixFieldStyles = {
            ...inputProps.style,
            ...{ paddingStart: 38 },
          };

          inputProps = {
            ...inputProps,
            style: prefixFieldStyles,
          };
        }
        break;
      case 'decimal':
        inputProps = { ...inputProps, ...{ keyboardType: 'numeric' } };
        break;
      case 'password': {
        const passwordFieldStyles = hidePasswordRevealer ? {} : { ...inputProps.style, ...theme.form.inputPassword };
        inputProps = {
          ...inputProps,
          style: passwordFieldStyles,
          secureTextEntry: !showPassword,
        };
        inputGroupSuffix = !hidePasswordRevealer ? (
          <Button
            type="secondary"
            onPress={this.toggleShowPassword}
            containerStyle={styles.passwordButton}
            icon={showPassword ? icons.eyeOpen : icons.eyeClosed}
            iconColor={showPassword ? theme.colors.primaryColor : theme.colors.disabled}
            iconSize={20}
          />
        ) : undefined;
        break;
      }
      case 'phone':
        inputProps = { ...inputProps, ...{ keyboardType: 'number-pad' } };
        if (inputPrefixText && inputPrefixText.length > 0) {
          inputGroupPrefix = PlatformUtils.isMobile() ? (
            <TouchableOpacity style={styles.inputGroupPrefix} onPress={this.fetchPhoneCodes}>
              {this.fetchFlag()}
              <Label type="regular" style={styles.inputPrefixText}>
                {inputPrefixText}
              </Label>
              <Icon name={icons.downArrowFilled} color={theme.colors.darkTint7} size={12} style={styles.iconStyle} />
            </TouchableOpacity>
          ) : (
            webGroupPrefix &&
            webGroupPrefix({
              fetchPhoneCodes: this.fetchPhoneCodes,
              fetchFlag: this.fetchFlag,
              inputPrefixText,
              phoneCodes,
              isBottomSheetVisible,
              onCloseDropDownWeb: this.onCloseDropDownWeb,
            })
          );

          const prefixFieldStyles = {
            ...inputProps.style,
            ...theme.form.inputPrefix,
          };

          inputProps = {
            ...inputProps,
            maxLength: this.fetchPhoneLength(true),
            style: prefixFieldStyles,
          };
        }
        break;
      default:
        break;
    }

    const error = this.getFieldError();
    if (error || extraError) {
      inputProps.style = { ...inputProps.style, ...theme.form.fieldError };
      labelStyles = { ...labelStyles, color: theme.colors.error };
    }
    if (isFocused) {
      inputProps.style = { ...inputProps.style, ...theme.form.fieldFocus };
      labelStyles = { ...labelStyles, color: theme.colors.primaryColor };
    }
    if (!editable) {
      inputProps.style = { ...inputProps.style, ...theme.form.fieldDisabled };
    }

    return (
      <>
        <WithFieldError error={error || extraError} hideError={hideError}>
          <View style={styles.labels}>
            {label && (
              <View style={styles.labelContainer}>
                <Label type={labelTextType} textType={fontWeightType} style={labelStyles}>
                  {label}
                  {isMandatory && <Text style={styles.asterix}> *</Text>}
                </Label>
                {!!optionalText && (
                  <TouchableOpacity onPress={onPressOptional} disabled={!onPressOptional}>
                    <Label type="regular" style={[labelStyles, optionalStyle]}>
                      {optionalText}
                    </Label>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {secondaryLabel && <View style={styles.secondaryLabel}>{secondaryLabel}</View>}
          </View>
          <View style={containerStyle}>
            <RNTextInput ref={this.inputText} {...inputProps} />
            {children}
            {inputGroupPrefix}
            {inputGroupSuffix && <View style={styles.inputGroupSuffix}>{inputGroupSuffix}</View>}
            {!!inputGroupSuffixText && <TextInputSuffix text={inputGroupSuffixText} />}
          </View>
          {!!helpText && (
            <Label type="small" style={styles.helpText}>
              {helpText}
            </Label>
          )}
        </WithFieldError>
        {
          // todo: remove dependency from mobile
          PlatformUtils.isMobile() && (
            <BottomSheetListView
              data={phoneCodes}
              selectedValue={inputPrefixText}
              listTitle={phoneFieldDropdownText}
              isBottomSheetVisible={isBottomSheetVisible}
              onCloseDropDown={this.onCloseDropDown}
              onSelectItem={this.handleSelection}
            />
          )
        }
      </>
    );
  }

  private onCloseDropDown = (): void => {
    this.setState({ isBottomSheetVisible: false });
  };

  private onCloseDropDownWeb = (selectedOption: IDropdownOption): void => {
    this.handleSelection(selectedOption.value);
  };

  private fetchPhoneCodes = (): void => {
    const { isBottomSheetVisible, phoneCodes } = this.state;
    const { getCountries, countries } = this.props;

    if (countries.length <= 0) {
      getCountries();
      return;
    }
    if (phoneCodes.length <= 0) {
      const phoneCodesArr = countries
        .map((country) => country.phoneCodesDropdownData)
        .flat()
        .sort((a, b) => a.label.localeCompare(b.label));
      this.setState({ isBottomSheetVisible: !isBottomSheetVisible, phoneCodes: phoneCodesArr });
      return;
    }

    this.setState({ isBottomSheetVisible: !isBottomSheetVisible });
  };

  private fetchFlag = (): React.ReactElement | null => {
    const { formProps, countries, phoneCodeKey = PHONE_CODE } = this.props;
    for (let i = 0; i < countries.length; i++) {
      if (countries[i].phoneCodes[0].phoneCode.includes(formProps.values[phoneCodeKey])) {
        // console.log(
        //   '🚀 ~ file: FormTextInput.tsx:369 ~ FormTextInput ~ countries[i].:',
        //   countries[i].phoneCodes[0]._phoneCode
        // );
        if (countries[i].phoneCodes[0]._phoneCode == '+91') {
          return(<Image
            source={{
              uri: 'https://media.istockphoto.com/id/1270270387/vector/india-flag.jpg?s=612x612&w=0&k=20&c=sJrAdDoKVffgAm6xJlVmGGjVYxZGuSVzZ5DNnFJFbc8=',
            }}
            style={{ width: 24, height: 24 }}
          />);
        } else {
          return countries[i].flag;
        }
      }
    }
    return null;
  };

  private fetchPhoneLength = (isMax?: boolean): number => {
    const { formProps, countries, phoneCodeKey = PHONE_CODE } = this.props;
    for (let i = 0; i < countries.length; i++) {
      if (countries[i].phoneCodes[0].phoneCode.includes(formProps.values[phoneCodeKey])) {
        if (isMax) {
          return countries[i].phoneCodes[0].phoneNumberMaxLength;
        }
        return countries[i].phoneCodes[0].phoneNumberMinLength;
      }
    }

    return 10;
  };

  public focus = (): void => {
    this.inputText.current?.focus();
  };

  private handleTextChange = (text: string): void => {
    const { formProps, inputType, name, onValueChange } = this.props;
    const { setFieldValue } = formProps;
    const regExp = /^\s/;
    let inputValue = text;
    if (inputType === 'phone') {
      inputValue = text.replace(/\D/g, '');
    } else if (inputType === 'number') {
      inputValue = text.replace(/[^0-9.]/g, '');
      if (inputValue.split('.').length > 2) {
        inputValue = inputValue.replace(/\.+$/, '');
      }
      this.setState({ showCurrencySymbol: text.length > 0 });
    } else if (inputType === 'name') {
      inputValue = text.replace(/\d/g, '');
    } else if (inputType === 'email') {
      inputValue = text.replace(DisallowedInputCharacters.email, '');
    }
    /*
    RegExp added to remove trailing white space from the text
     */
    setFieldValue(name, inputValue.replace(regExp, ''));
    if (onValueChange) {
      onValueChange(inputValue);
    }
  };

  private handleFocus = (): void => this.setState({ isFocused: true });

  private handleBlur = (): void => {
    const {
      formProps: { values, setFieldError },
      name,
      inputType,
    } = this.props;

    this.setState({ isFocused: false });
    if (inputType === 'phone') {
      if (values && values.phone && values.phone.length < this.fetchPhoneLength()) {
        // TODO: Need to figure-out translation isssue
        setFieldError(name, 'Please enter a valid number');
      }
    }
  };

  private handleSelection = (value: string): void => {
    const { isBottomSheetVisible } = this.state;
    const { formProps, phoneCodeKey = PHONE_CODE } = this.props;
    formProps.setFieldValue(phoneCodeKey, value);

    this.setState({ isBottomSheetVisible: !isBottomSheetVisible });
  };

  private getFieldError = (): FormikErrors<any>[] | string | string[] | FormikErrors<any> | undefined => {
    const { name, formProps } = this.props;
    const { errors, touched } = formProps;
    return touched[name] && errors[name] ? errors[name] : undefined;
  };

  private toggleShowPassword = (): void => {
    const { showPassword } = this.state;
    this.setState({
      showPassword: !showPassword,
    });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    countries: CommonSelectors.getCountryList(state),
    defaultPhoneCode: CommonSelectors.getDefaultPhoneCode(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getCountries } = CommonActions;
  return bindActionCreators(
    {
      getCountries,
    },
    dispatch
  );
};

const HOC = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(FormTextInput);
export { HOC as FormTextInput };

const styles = StyleSheet.create({
  inputGroupPrefix: {
    position: 'absolute',
    left: 1,
    marginTop: 2,
    right: 5,
    width: 90,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',

    backgroundColor: theme.colors.background,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: theme.colors.disabled,
  },
  currencyPrefix: {
    position: 'absolute',
    left: 1,
    marginTop: 5,
    width: 46,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  currencyPrefixText: {
    fontSize: 18,
  },
  inputPrefixText: {
    color: theme.colors.darkTint4,
    marginStart: 8,
  },
  inputGroupSuffix: {
    position: 'absolute',
    right: 6,
    paddingVertical: 14,
  },
  passwordButton: {
    flex: 0,
    paddingHorizontal: 10,
    borderWidth: 0,
    backgroundColor: theme.colors.transparent,
  },
  helpText: {
    color: theme.colors.darkTint4,
    marginTop: 6,
  },
  flagStyle: {
    borderRadius: 2,
    width: 24,
    height: 24,
    marginEnd: 6,
  },
  iconStyle: {
    marginStart: 6,
  },
  asterix: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: 'bold',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secondaryLabel: {
    marginTop: 16,
    marginBottom: 6,
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
