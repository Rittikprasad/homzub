import React, { PureComponent, ReactElement } from 'react';
import { StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { FormikProps } from 'formik';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { RNSwitch } from '@homzhub/common/src/components/atoms/Switch';
import { Label, Text, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';

interface IFormDetails {
  formProps: FormikProps<any>;
  name: string;
}

interface IPromoProps {
  isError?: boolean;
  isPromoApplied?: boolean;
  onClear?: () => void;
  onApplyPromo?: (code: string) => void;
  formDetails?: IFormDetails;
  code?: string;
  type: 'link' | 'regular';
  containerStyles?: StyleProp<ViewStyle>;
  inputStyles?: StyleProp<TextStyle>;
  shouldShowText?: boolean;
  label?: string;
  textType?: TextSizeType;
  hasToggleButton?: boolean;
  isToggleButtonSelected?: boolean;
  isToggleButtonDisabled?: boolean;
  onToggle?: () => void;
}
type Props = IPromoProps & WithTranslation;

interface IPromoState {
  promoCode: string;
  showTextInput: boolean;
}

class PromoCode extends PureComponent<Props, IPromoState> {
  constructor(props: Props) {
    super(props);
    const { shouldShowText } = this.props;
    this.state = {
      promoCode: '',
      showTextInput: shouldShowText ?? false,
    };
  }

  // Clear promo code when toggle button is unselected.
  public componentDidUpdate(prevProps: Props): void {
    const { isToggleButtonSelected } = this.props;
    const { isToggleButtonSelected: prevToggle } = prevProps;
    if (prevToggle && !isToggleButtonSelected) {
      this.setFieldValue('');
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        promoCode: '',
      });
    }
  }

  public render(): React.ReactNode {
    const {
      t,
      containerStyles,
      type,
      code,
      label,
      textType,
      hasToggleButton = false,
      isToggleButtonSelected = false,
      isToggleButtonDisabled = false,
      onToggle = FunctionUtils.noop,
    } = this.props;
    const { showTextInput } = this.state;
    const showTextField = type === 'regular' || showTextInput || code;

    return (
      <View style={[styles.container, containerStyles]}>
        {type !== 'link' ? (
          <View style={styles.switchContainer}>
            <Text type="small" style={[styles.title, isToggleButtonDisabled && styles.disabled]}>
              {t('havePromoCode')}
            </Text>
            {!!hasToggleButton && (
              <RNSwitch disabled={isToggleButtonDisabled} selected={isToggleButtonSelected} onToggle={onToggle} />
            )}
          </View>
        ) : (
          <Label
            onPress={this.toggleTextInput}
            style={showTextField ? undefined : { color: theme.colors.primaryColor }}
            type={textType ?? 'large'}
          >
            {label ?? t('auth:haveReferralCodeText')}
          </Label>
        )}
        {type === 'regular' ? this.renderPromoCode() : this.renderReferralCode()}
      </View>
    );
  }

  private renderPromoCode = (): ReactElement | null => {
    const {
      t,
      isError,
      isPromoApplied = false,
      inputStyles,
      hasToggleButton = false,
      isToggleButtonSelected,
      isToggleButtonDisabled = false,
    } = this.props;
    const { promoCode } = this.state;
    const value = isPromoApplied ? `${promoCode} Applied!` : promoCode;
    const showPromoInput = (): boolean => {
      if (hasToggleButton) return Boolean(hasToggleButton && isToggleButtonSelected);
      return true;
    };
    const showTextInput = showPromoInput();
    const isEditable = !isToggleButtonDisabled && !isPromoApplied;

    if (!showTextInput) return null;
    return (
      <>
        <View style={styles.textInputContainer}>
          <TextInput
            value={value}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder={t('promoPlaceholder')}
            placeholderTextColor={!isEditable ? theme.colors.disabled : undefined}
            numberOfLines={1}
            onChangeText={this.handlePromoChange}
            editable={isEditable}
            style={[
              styles.textInput,
              !isEditable && styles.disabled,
              isPromoApplied && { color: theme.colors.green },
              inputStyles,
            ]}
          />
          {this.renderButton()}
        </View>
        {isError && (
          <Label type="regular" textType="semiBold" style={styles.errorMsg}>
            {t('promoError')}
          </Label>
        )}
      </>
    );
  };

  private renderReferralCode = (): React.ReactNode => {
    const { t, inputStyles, formDetails, code } = this.props;
    const { showTextInput } = this.state;
    const showTextField = showTextInput || code;

    if (!formDetails) {
      return null;
    }

    return (
      <View style={inputStyles}>
        {showTextField && (
          <FormTextInput
            formProps={formDetails.formProps}
            inputType="default"
            name={formDetails.name}
            placeholder={t('auth:referralCodePlaceholder')}
            numberOfLines={1}
            maxLength={10}
            inputGroupSuffix={this.renderButton()}
          />
        )}
      </View>
    );
  };

  private renderButton = (): React.ReactNode => {
    const { t, isPromoApplied = false, type } = this.props;
    const { promoCode } = this.state;
    if (!promoCode.length) return null;
    return (
      <>
        {isPromoApplied || type === 'link' ? (
          <Button
            type="primary"
            icon={icons.circularCrossFilled}
            iconSize={20}
            iconColor={theme.colors.darkTint8}
            containerStyle={type === 'regular' ? styles.iconButton : styles.crossIconBgColor}
            onPress={this.onCrossPress}
            testID="btnCross"
          />
        ) : (
          <Button
            type="secondary"
            title={t('apply')}
            containerStyle={styles.button}
            titleStyle={styles.buttonTitle}
            onPress={this.onApplyPress}
          />
        )}
      </>
    );
  };

  private onCrossPress = (): void => {
    const { onApplyPromo } = this.props;
    if (onApplyPromo) {
      onApplyPromo('');
    }
    this.setFieldValue('');
    this.setState({
      promoCode: '',
    });
  };

  private onApplyPress = (): void => {
    const { onApplyPromo } = this.props;
    const { promoCode } = this.state;
    if (onApplyPromo) {
      onApplyPromo(promoCode);
    }
  };

  private handlePromoChange = (text: string): void => {
    this.setState({ promoCode: text });
  };

  private setFieldValue = (text: string): void => {
    const { formDetails } = this.props;

    if (formDetails) {
      formDetails.formProps.setFieldValue(formDetails.name, text);
    }
  };

  private toggleTextInput = (): void => {
    this.setState({ showTextInput: true });
  };
}

export default withTranslation()(PromoCode);

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  title: {
    color: theme.colors.darkTint4,
  },
  disabled: {
    color: theme.colors.disabled,
  },
  textInputContainer: {
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginVertical: 8,
    borderColor: theme.colors.darkTint10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    color: theme.colors.darkTint1,
  },
  button: {
    borderWidth: 0,
    flex: 0,
  },
  buttonTitle: {
    marginVertical: 0,
    marginHorizontal: 16,
    alignSelf: 'flex-end',
  },
  errorMsg: {
    color: theme.colors.error,
  },
  iconButton: {
    backgroundColor: theme.colors.secondaryColor,
    flex: 0,
    marginHorizontal: 16,
  },
  crossIconBgColor: {
    backgroundColor: theme.colors.secondaryColor,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
