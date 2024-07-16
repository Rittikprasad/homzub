import React, { createRef, PureComponent, RefObject } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput, IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import { ILoginFormData } from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface ILoginFormProps extends WithTranslation {
  isEmailLogin?: boolean;
  handleForgotPassword?: () => void;
  onLoginSuccess: (payload: ILoginFormData) => void;
  testID?: string;
  webGroupPrefix?: (params: IWebProps) => React.ReactElement;
}

interface IFormData {
  email: string;
  phone: string;
  password: string;
  isEmailFlow: boolean;
  phoneCode: string;
}
interface IStateProps {
  defaultPhoneCode: string;
}

interface IProps {
  title?: string;
  subTitle?: string;
  buttonTitle?: string;
  isFromLogin?: boolean;
}

type Props = ILoginFormProps & IStateProps & IProps;
class LoginForm extends PureComponent<Props, IFormData> {
  public password: RefObject<any> = createRef();

  public constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      phone: '',
      password: '',
      isEmailFlow: props.isEmailLogin || false,
      phoneCode: '',
    };
  }

  public componentDidMount(): void {
    const { defaultPhoneCode } = this.props;
    this.setState({ phoneCode: defaultPhoneCode });
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<IFormData>): void {
    const { defaultPhoneCode: prevDefaultPhoneCode } = prevProps;
    const { defaultPhoneCode } = this.props;
    if (prevDefaultPhoneCode !== defaultPhoneCode) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ phoneCode: defaultPhoneCode });
    }
  }

  public render(): React.ReactNode {
    const { t, handleForgotPassword, isEmailLogin, testID, buttonTitle } = this.props;
    const formData = { ...this.state };
    return (
      <KeyboardAvoidingView style={styles.flexOne} behavior={PlatformUtils.isIOS() ? 'padding' : undefined}>
        <Formik
          initialValues={formData}
          enableReinitialize
          validate={FormUtils.validate(isEmailLogin ? this.loginEmailFormSchema : this.loginPhoneFormSchema)}
          onSubmit={this.handleSubmit}
        >
          {(formProps: FormikProps<IFormData>): React.ReactElement => (
            <>
              {this.renderLoginFields(formProps)}
              <FormButton
                // @ts-ignore
                onPress={formProps.handleSubmit}
                formProps={formProps}
                type="primary"
                title={buttonTitle || t('login')}
                containerStyle={styles.submitStyle}
              />
              {isEmailLogin && PlatformUtils.isMobile() && handleForgotPassword && (
                <Button
                  type="secondary"
                  title={t('auth:forgotPassword')}
                  fontType="semiBold"
                  textSize="small"
                  onPress={handleForgotPassword}
                  containerStyle={styles.forgotButtonStyle}
                  testID={testID}
                />
              )}
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    );
  }

  private renderLoginFields = (formProps: FormikProps<IFormData>): React.ReactElement => {
    const { t, handleForgotPassword, isEmailLogin, webGroupPrefix } = this.props;

    const onPasswordFocus = (): void => this.password.current?.focus();

    const ForgotPasswordButtonWeb = React.memo(() => (
      <Button
        type="secondary"
        title={t('auth:forgotPassword')}
        fontType="semiBold"
        textSize="small"
        onPress={handleForgotPassword}
        containerStyle={PlatformUtils.isWeb() ? styles.forgotButtonStyleWeb : null}
        titleStyle={styles.forgotButtonTextStyle}
      />
    ));

    return (
      <>
        {isEmailLogin ? (
          <>
            <FormTextInput
              name="email"
              label="Email"
              inputType="email"
              placeholder={t('auth:enterEmail')}
              isMandatory
              formProps={formProps}
              onSubmitEditing={onPasswordFocus}
            />
            <FormTextInput
              ref={this.password}
              name="password"
              label="Password"
              inputType="password"
              placeholder={t('auth:newPassword')}
              isMandatory
              formProps={formProps}
              // secondaryLabel={<ForgotPasswordButtonWeb />}
            />
          </>
        ) : (
          <FormTextInput
            name="phone"
            label="Phone"
            inputType="phone"
            inputPrefixText={formProps.values.phoneCode}
            placeholder={t('auth:yourNumber')}
            helpText={t('auth:otpVerification')}
            phoneFieldDropdownText={t('auth:countryRegion')}
            isMandatory
            formProps={formProps}
            webGroupPrefix={webGroupPrefix}
          />
        )}
      </>
    );
  };

  public handleSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
    const { onLoginSuccess, isEmailLogin, t, isFromLogin } = this.props;
    console.log('🚀 ~ file: LoginForm.tsx ~ line 174 ~ LoginForm ~ handleSubmit= ~ onLoginSuccess', onLoginSuccess);
    formActions.setSubmitting(true);
    if (!isEmailLogin) {
      try {
        const phone = `${values.phoneCode}~${values.phone}`;
        const isPhoneUsed = await UserRepository.phoneExists(phone);
        if (!isFromLogin && PlatformUtils.isWeb() && isPhoneUsed.is_exists) {
          AlertHelper.error({ message: t('auth:phoneAlreadyExists') });
          return;
        }
        if (isFromLogin && PlatformUtils.isWeb() && !isPhoneUsed.is_exists) {
          AlertHelper.error({ message: t('auth:phoneNotExists') });
          return;
        }
        if (!PlatformUtils.isWeb() && !isPhoneUsed.is_exists) {
          AlertHelper.error({ message: t('auth:phoneNotExists') });
          return;
        }
      }catch (err: any) {        console.log('🚀 ~ file: LoginForm.tsx ~ line 193 ~ LoginForm ~ handleSubmit= ~ err', err.details);
        AlertHelper.error({ message: t('common:genericErrorMessage'), statusCode: err.details.statusCode });
        return;
      }
    }
    const loginFormData: ILoginFormData = {
      email: values.email,
      password: values.password,
      phone_code: values.phoneCode,
      phone_number: values.phone,
    };
    onLoginSuccess(loginFormData);
    formActions.setSubmitting(false);
  };

  private loginPhoneFormSchema = (): yup.ObjectSchema<{
    phone: string;
  }> => {
    const { t } = this.props;
    return yup.object().shape({
      phone: yup.string().required(t('moreProfile:fieldRequiredError')),
    });
  };

  private loginEmailFormSchema = (): yup.ObjectSchema<{
    email: string;
    password: string;
  }> => {
    const { t } = this.props;
    return yup.object().shape({
      email: yup.string().email(t('auth:emailValidation')).required(t('auth:emailRequired')),
      password: yup
        .string()
        .matches(FormUtils.passwordRegex, t('auth:passwordValidation'))
        .min(6, t('auth:minimumCharacters', { count: 6 }))
        .required(t('auth:passwordRequired')),
    });
  };
}
const mapStateToProps = (state: IState): IStateProps => {
  return {
    defaultPhoneCode: CommonSelectors.getDefaultPhoneCode(state),
  };
};
const HOC = withTranslation()(connect(mapStateToProps)(LoginForm));
export { HOC as LoginForm };

const styles = StyleSheet.create({
  submitStyle: {
    flex: 1,
    marginTop: 30,
  },
  forgotButtonStyle: {
    borderWidth: 0,
    flex: 0,
    marginTop: 16,
  },
  webLoginPasswordField: {
    position: 'relative',
  },
  forgotButtonStyleWeb: {
    borderWidth: 0,
    width: 'fit-content',
  },
  forgotButtonTextStyle: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  flexOne: {
    flex: 1,
  },
});
