import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import Logo from '@homzhub/common/src/assets/images/logo.svg';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput, IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { TermsCondition } from '@homzhub/common/src/components/molecules/TermsAndCondition';
import { PrivacyPolicy } from '@homzhub/common/src/components/molecules/PrivacyPolicy';

interface IProps {
  onPressLink: () => void;
  onPressPrivacyLink: () => void;
  onSubmit: (payload: ISignUpPayload) => void;
  onBack: () => void;
  webGroupPrefix?: (params: IWebProps) => React.ReactElement;
}

interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  password: string;
  companyName: string;
}

const SignupForm = (props: IProps): React.ReactElement => {
  const { onSubmit, onBack, onPressLink, onPressPrivacyLink, webGroupPrefix } = props;
  const lastName: React.RefObject<any> = useRef();
  const email: React.RefObject<any> = useRef();
  const phone: React.RefObject<any> = useRef();
  const { t } = useTranslation();
  const defaultPhoneCode = useSelector(CommonSelectors.getDefaultPhoneCode);
  const selectedRole = useSelector(FFMSelector.getSelectedRole);
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    phoneCode: '',
    companyName: '',
  });

  useEffect(() => {
    setState({ ...state, phoneCode: defaultPhoneCode });
  }, []);

  const formSchema = (): yup.ObjectSchema<IFormData> => {
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
      companyName: yup.string(),
    });
  };

  const handleSubmit = (values: IFormData, formActions: FormikHelpers<IFormData>): void => {
    formActions.setSubmitting(true);
    const signUpData: ISignUpPayload = {
      first_name: values.firstName,
      ...(values.lastName && { last_name: values.lastName }),
      email: values.email,
      phone_code: values.phoneCode,
      phone_number: values.phone,
      password: values.password,
      company: {
        name: values.companyName,
      },
      role: selectedRole?.id,
    };
    onSubmit(signUpData);
    formActions.setSubmitting(false);
  };

  return (
    <>
      <Logo style={styles.logo} />
      <Formik<IFormData>
        initialValues={{ ...state }}
        validate={FormUtils.validate(formSchema)}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formProps: FormikProps<IFormData>): React.ReactNode => {
          const onEmailFocus = (): void => email.current?.focus();
          const onLastNameFocus = (): void => lastName.current?.focus();
          const onPhoneNumberFocus = (): void => phone.current?.focus();
          return (
            <>
              <FormTextInput
                name="firstName"
                label={t('property:firstName')}
                inputType="name"
                placeholder={t('auth:enterFirstName')}
                formProps={formProps}
                maxLength={40}
                isMandatory
                onSubmitEditing={onLastNameFocus}
              />
              <FormTextInput
                ref={lastName}
                name="lastName"
                label={t('property:lastName')}
                inputType="name"
                maxLength={40}
                placeholder={t('auth:enterLastName')}
                formProps={formProps}
                onSubmitEditing={onEmailFocus}
              />
              <FormTextInput
                ref={email}
                name="email"
                label={t('moreSettings:emailsText')}
                inputType="email"
                isMandatory
                placeholder={t('auth:enterEmail')}
                formProps={formProps}
                onSubmitEditing={onPhoneNumberFocus}
              />
              <FormTextInput
                ref={phone}
                name="phone"
                label={t('phone')}
                isMandatory
                inputType="phone"
                inputPrefixText={formProps.values.phoneCode}
                webGroupPrefix={webGroupPrefix}
                placeholder={t('auth:yourNumber')}
                helpText={t('auth:otpVerification')}
                phoneFieldDropdownText={t('auth:countryRegion')}
                formProps={formProps}
              />
              <FormTextInput
                name="password"
                label={t('password')}
                inputType="password"
                isMandatory
                placeholder={t('auth:newPassword')}
                helpText={t('auth:passwordValidation')}
                formProps={formProps}
              />
              <FormTextInput
                name="companyName"
                label={t('companyName')}
                inputType="default"
                maxLength={40}
                placeholder={t('yourCompanyName')}
                formProps={formProps}
              />
              <TermsCondition onPressLink={onPressLink} />
              <PrivacyPolicy onPressLink={onPressPrivacyLink} />
              <View style={styles.buttonContainer}>
                <Button type="secondary" title={t('backText')} containerStyle={styles.buttonStyle} onPress={onBack} />
                <View style={styles.separator} />
                <FormButton
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  formProps={formProps}
                  type="primary"
                  title={t('next')}
                  containerStyle={styles.buttonStyle}
                />
              </View>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default SignupForm;

const styles = StyleSheet.create({
  buttonStyle: {
    marginVertical: 16,
  },
  separator: {
    marginHorizontal: 16,
  },
  logo: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 16,
  },
});
