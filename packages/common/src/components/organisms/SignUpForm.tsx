import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput, IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import { TermsCondition } from '@homzhub/common/src/components/molecules/TermsAndCondition';
import PromoCode from '@homzhub/common/src/components/molecules/PromoCode';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { PrivacyPolicy } from '../molecules/PrivacyPolicy';

interface ISignUpFormProps extends WithTranslation {
  testID?: string;
  onPressLink: () => void;
  onPressPrivacyLink: () => void;
  onSubmitFormSuccess: (payload: ISignUpPayload) => void;
  referralCode?: string;
  webGroupPrefix?: (params: IWebProps) => React.ReactElement;
}
interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  password: string;
  referralCode?: string;
}
interface IStateProps {
  defaultPhoneCode: string;
}
type Props = IStateProps & ISignUpFormProps;
class SignUpForm extends PureComponent<Props, IFormData> {
  public lastName: React.RefObject<any> = React.createRef();
  public email: React.RefObject<any> = React.createRef();
  public phone: React.RefObject<any> = React.createRef();
  public state = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    phoneCode: '',
    referralCode: '',
  };

  public componentDidMount(): void {
    const { referralCode, defaultPhoneCode } = this.props;
    this.setState({ referralCode, phoneCode: defaultPhoneCode });
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<IFormData>): void {
    const { defaultPhoneCode: prevDefaultPhoneCode } = prevProps;
    const { referralCode, defaultPhoneCode } = this.props;
    if (prevDefaultPhoneCode !== defaultPhoneCode) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ referralCode, phoneCode: defaultPhoneCode });
    }
  }

  public render(): React.ReactNode {
    const { t, testID, onPressLink, onPressPrivacyLink, referralCode, webGroupPrefix } = this.props;
    return (
      <Formik<IFormData>
        initialValues={{ ...this.state }}
        validate={FormUtils.validate(this.formSchema)}
        onSubmit={this.handleSubmit}
        enableReinitialize
      >
        {(formProps: FormikProps<IFormData>): React.ReactNode => {
          // console.log("🚀 ~ file: SignUpForm.tsx ~ line 77 ~ SignUpForm ~ render ~ formProps", formProps.handleSubmit())
          const onEmailFocus = (): void => this.email.current?.focus();
          const onLastNameFocus = (): void => this.lastName.current?.focus();
          const onPhoneNumberFocus = (): void => this.phone.current?.focus();
          return (
            <>
              <FormTextInput
                name="firstName"
                label="First Name"
                inputType="name"
                placeholder={t('auth:enterFirstName')}
                formProps={formProps}
                maxLength={PlatformUtils.isWeb() ? 50 : 40}
                isMandatory
                onSubmitEditing={onLastNameFocus}
              />
              <FormTextInput
                ref={this.lastName}
                name="lastName"
                label="Last Name"
                inputType="name"
                maxLength={PlatformUtils.isWeb() ? 50 : 40}
                placeholder={t('auth:enterLastName')}
                formProps={formProps}
                onSubmitEditing={onEmailFocus}
              />
              <FormTextInput
                ref={this.email}
                name="email"
                label="Email"
                inputType="email"
                isMandatory
                placeholder={t('auth:enterEmail')}
                formProps={formProps}
                onSubmitEditing={onPhoneNumberFocus}
              />
              <FormTextInput
                ref={this.phone}
                name="phone"
                label="Phone"
                isMandatory
                inputType="phone"
                webGroupPrefix={webGroupPrefix}
                inputPrefixText={formProps.values.phoneCode}
                placeholder={t('auth:yourNumber')}
                helpText={t('auth:otpVerification')}
                phoneFieldDropdownText={t('auth:countryRegion')}
                formProps={formProps}
              />
              <FormTextInput
                name="password"
                label="Password"
                inputType="password"
                isMandatory
                placeholder={t('auth:newPassword')}
                helpText={t('auth:passwordValidation')}
                formProps={formProps}
              />
              <PromoCode
                type="link"
                formDetails={{ formProps, name: 'referralCode' }}
                code={referralCode}
                containerStyles={styles.referralContainer}
                inputStyles={styles.referralInputStyle}
                shouldShowText
                label={t('common:referralCode')}
                textType="regular"
              />
              <TermsCondition onPressLink={onPressLink} />
              <PrivacyPolicy onPressLink={onPressPrivacyLink} />
              <FormButton
                // @ts-ignore
                onPress={formProps.handleSubmit}
                formProps={formProps}
                type="primary"
                title={t('auth:signup')}
                containerStyle={styles.submitStyle}
                testID={testID}
              />
            </>
          );
        }}
      </Formik>
    );
  }

  private formSchema = (): yup.ObjectSchema<IFormData> => {
    const { t } = this.props;
    return yup.object().shape({
      firstName: yup.string().matches(FormUtils.nameRegex, t('auth:onlyAlphabets')).required(t('auth:nameRequired')),
      lastName: yup.string(),
      email: yup.string().email(t('auth:emailValidation')).required(t('auth:emailRequired')),
      phoneCode: yup.string(),
      phone: yup.string().required(t('auth:numberRequired')),
      password: yup
        .string()
        .matches(FormUtils.passwordRegex, t('auth:passwordValidation'))
        .min(6, t('auth:minimumCharacters', { count: 6 }))
        .required(t('auth:passwordRequired')),
      referralCode: yup.string().optional().uppercase(t('auth:upperCaseError')).strict(true).max(10),
    });
  };

  public handleSubmit = (values: IFormData, formActions: FormikHelpers<IFormData>): void => {
    const { onSubmitFormSuccess } = this.props;
    formActions.setSubmitting(true);
    const signUpData: ISignUpPayload = {
      first_name: values.firstName,
      ...(values.lastName && { last_name: values.lastName }),
      email: values.email,
      phone_code: values.phoneCode,
      phone_number: values.phone,
      password: values.password,
      ...(values.referralCode && { signup_referral_code: values.referralCode }),
    };
    console.log('🚀 ~ file: SignUpForm.tsx ~ line 193 ~ SignUpForm ~ signUpData', signUpData);
    onSubmitFormSuccess(signUpData);
    formActions.setSubmitting(false);
  };
}
const mapStateToProps = (state: IState): IStateProps => {
  return {
    defaultPhoneCode: CommonSelectors.getDefaultPhoneCode(state),
  };
};

const HOC = withTranslation()(connect(mapStateToProps)(SignUpForm));
export { HOC as SignUpForm };

const styles = StyleSheet.create({
  submitStyle: {
    flex: 1,
    marginVertical: 4,
  },
  referralInputStyle: {
    paddingTop: 12,
  },
  referralContainer: {
    marginBottom: 0,
    marginHorizontal: 0,
    marginVertical: 16,
  },
});
