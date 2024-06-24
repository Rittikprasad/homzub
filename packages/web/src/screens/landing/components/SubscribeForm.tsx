import React, { FC } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IFormData {
  emailAddress: string;
}
interface IProp {
  onUserSubscription: () => void;
}
const SubscribeForm: FC<IProp> = ({ onUserSubscription }: IProp) => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.auth);
  const isDesktop = useDown(deviceBreakpoint.DESKTOP);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const formStyles = formStyle(isMobile, isDesktop);
  const formData = {
    emailAddress: '',
  };

  const handleSubmit = (values: IFormData, formActions: FormikHelpers<IFormData>): void => {
    formActions.setSubmitting(true);

    CommonRepository.subscribeToNewsLetter({ email: values.emailAddress })
      .then(() => {
        onUserSubscription();
        formActions.setSubmitting(false);
      })
      .catch((error) => {
        const errorMessage = ErrorUtils.getErrorMessage(error.details);
        AlertHelper.error({ message: errorMessage, statusCode: error.details.statusCode });
      });
  };

  const subscribeFormSchema = (): yup.ObjectSchema<IFormData> => {
    return yup.object().shape({
      emailAddress: yup.string().email(t('auth:emailValidation')).required(t('auth:emailRequired')),
    });
  };

  return (
    <View style={formStyles.container}>
      <Formik initialValues={formData} onSubmit={handleSubmit} validate={FormUtils.validate(subscribeFormSchema)}>
        {(formProps: FormikProps<IFormData>): React.ReactElement => (
          <View style={formStyles.formContent}>
            <FormTextInput
              name="emailAddress"
              label=""
              inputType="email"
              placeholder={t('auth:enterEmailText')}
              formProps={formProps}
              style={formStyles.emailStyles}
              placeholderTextColor={theme.colors.darkTint7}
              containerStyle={formStyles.emailStylesView}
            />
            <FormButton
              // @ts-ignore
              onPress={formProps.handleSubmit}
              formProps={formProps}
              type="primary"
              title={t('landing:subscribePopupButtonText')}
              containerStyle={formStyles.button}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

interface IFormItemSTyle {
  container: ViewStyle;
  button: ViewStyle;
  formContent: ViewStyle;
  titleStyle: ViewStyle;
  emailStyles: ViewStyle;
  emailStylesView: ViewStyle;
}

const formStyle = (isMobile: boolean, isDesktop: boolean): StyleSheet.NamedStyles<IFormItemSTyle> =>
  StyleSheet.create<IFormItemSTyle>({
    container: {
      width: '100%',
    },
    formContent: {
      margin: isMobile ? 0 : 10,
      width: isMobile ? '90%' : '60%',
      alignSelf: 'center',
      marginTop: 36,
    },
    button: {
      backgroundColor: theme.colors.blue,
      marginTop: 20,
    },
    titleStyle: {
      color: theme.colors.white,
      marginHorizontal: isMobile ? 8 : 36,
    },
    emailStyles: {
      margin: 0,
    },
    emailStylesView: {
      backgroundColor: theme.colors.background,
      textAlign: 'center',
      justifyContent: 'center',
    },
  });

export default SubscribeForm;
