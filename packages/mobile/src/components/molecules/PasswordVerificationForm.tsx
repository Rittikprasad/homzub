import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
  onFormSubmit: (password: string) => void;
}

interface IFormData {
  password: string;
}

interface IState {
  formData: IFormData;
}

export class PasswordVerificationForm extends React.PureComponent<IProps, IState> {
  public state = {
    formData: {
      password: '',
    },
  };

  public render(): ReactElement {
    const { t } = this.props;
    const { formData } = this.state;

    return (
      <>
        <Formik
          onSubmit={this.onSubmit}
          initialValues={formData}
          validate={FormUtils.validate(this.formSchema)}
          enableReinitialize
        >
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            return (
              <>
                <View style={styles.container}>
                  <FormTextInput
                    name="password"
                    label={t('yourCurrentPassword')}
                    inputType="password"
                    placeholder={t('yourCurrentPassword')}
                    formProps={formProps}
                    isMandatory
                  />
                </View>
                <Label style={styles.textStyle} type="large">
                  {t('continueToGetOtp')}
                </Label>
                <FormButton
                  formProps={formProps}
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  type="primary"
                  title={t('common:continue')}
                  containerStyle={styles.buttonStyle}
                />
              </>
            );
          }}
        </Formik>
      </>
    );
  }

  private onSubmit = (values: IFormData, formikHelpers: FormikHelpers<IFormData>): void => {
    const { onFormSubmit } = this.props;

    formikHelpers.setSubmitting(true);
    onFormSubmit(values.password);
  };

  private formSchema = (): yup.ObjectSchema<IFormData> => {
    const { t } = this.props;

    return yup.object().shape({
      password: yup.string().required(t('fieldRequiredError')),
    });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.moreProfile)(PasswordVerificationForm);

const styles = StyleSheet.create({
  container: {
    marginBottom: 60,
    paddingHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
  },
  buttonStyle: {
    flex: 0,
    margin: 12,
  },
  textStyle: {
    textAlign: 'center',
  },
});
