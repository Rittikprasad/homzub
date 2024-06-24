/* eslint-disable react/sort-comp */
import React, { createRef, PureComponent, RefObject } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import PhoneCodePrefix from '@homzhub/web/src/components/molecules/PhoneCodePrefix';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput, IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import { ILoginFormData } from '@homzhub/common/src/domain/repositories/interfaces';

interface ILoginFormProps extends WithTranslation {
  isEmailLogin?: boolean;
  handleForgotPassword?: () => void;
  onLoginSuccess: (payload: ILoginFormData) => void;
  testID?: string;
  buttonTitle?: string;
}

interface IFormData {
  email: string;
  phone: string;
  password: string;
  isEmailFlow: boolean;
  phoneCode: string;
}

class MobileVerificationForm extends PureComponent<ILoginFormProps, IFormData> {
  public password: RefObject<any> = createRef();

  public constructor(props: ILoginFormProps) {
    super(props);
    this.state = {
      email: '',
      phone: '',
      password: '',
      isEmailFlow: props.isEmailLogin || false,
      phoneCode: '',
    };
  }

  public render(): React.ReactNode {
    const { t, buttonTitle } = this.props;
    const formData = { ...this.state };
    return (
      <KeyboardAvoidingView style={styles.flexOne} behavior={PlatformUtils.isIOS() ? 'padding' : undefined}>
        <Formik
          initialValues={formData}
          validate={FormUtils.validate(this.loginPhoneFormSchema)}
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
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    );
  }

  public handleSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
    formActions.setSubmitting(true);
    const { t } = this.props;
    try {
      const phone = `${values.phoneCode}~${values.phone}`;
      const isPhoneUsed = await UserRepository.phoneExists(phone);
      if (!isPhoneUsed.is_exists) {
        AlertHelper.error({ message: t('auth:phoneNotExists') });
        return;
      }
    } catch (err) {
      AlertHelper.error({ message: t('common:genericErrorMessage'), statusCode: err.details.statusCode });
      return;
    }

    // Add Navigation Here
    formActions.setSubmitting(false);
  };

  private handleWebView = (params: IWebProps): React.ReactElement => {
    return <PhoneCodePrefix {...params} />;
  };

  private renderLoginFields = (formProps: FormikProps<IFormData>): React.ReactElement => {
    const { t } = this.props;
    return (
      <FormTextInput
        name="phone"
        label={t('common:phone')}
        isMandatory
        inputType="phone"
        webGroupPrefix={this.handleWebView}
        inputPrefixText={formProps.values.phoneCode}
        placeholder={t('auth:yourNumber')}
        helpText={t('auth:otpVerification')}
        phoneFieldDropdownText={t('auth:countryRegion')}
        formProps={formProps}
      />
    );
  };

  private loginPhoneFormSchema = (): yup.ObjectSchema<{
    phone: string;
  }> => {
    const { t } = this.props;
    return yup.object().shape({
      phone: yup.string().required(t('moreProfile:fieldRequiredError')),
    });
  };
}

const HOC = withTranslation()(MobileVerificationForm);
export { HOC as MobileVerificationForm };

const styles = StyleSheet.create({
  submitStyle: {
    flex: 0,
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
