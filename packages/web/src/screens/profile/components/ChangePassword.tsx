import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { IUpdatePassword, ResetPasswordTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IChangePasswordForm {
  currentPassword: string;
  newPassword: string;
}

interface IScreenState {
  formData: IChangePasswordForm;
}

interface IProps {
  isOpen?: boolean;
  handlePopupClose: () => void;
}

type Props = WithTranslation & IProps;

class ChangePassword extends Component<Props, IScreenState> {
  public state = {
    formData: {
      currentPassword: '',
      newPassword: '',
    },
  };

  public render(): React.ReactNode {
    return <View>{this.renderForm()}</View>;
  }

  private renderForm = (): React.ReactElement => {
    const { formData } = this.state;
    const { t, handlePopupClose } = this.props;
    const initialFormValues = { ...formData };
    return (
      <>
        <Formik
          onSubmit={this.handleSubmit}
          initialValues={initialFormValues}
          validate={FormUtils.validate(this.formSchema)}
          enableReinitialize
        >
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            const { currentPassword, newPassword } = formProps.values;
            return (
              <View style={styles.formikView}>
                <FormTextInput
                  name="currentPassword"
                  label={t('currentPassword')}
                  inputType="password"
                  formProps={formProps}
                  isMandatory
                />
                <FormTextInput
                  name="newPassword"
                  label={t('createNewPassword')}
                  inputType="password"
                  helpText={t('passwordValidation')}
                  formProps={formProps}
                  isMandatory
                />
                <View style={styles.modalFooter}>
                  <FormButton
                    formProps={formProps}
                    title={t('common:cancel')}
                    type="secondary"
                    onPress={(): void => handlePopupClose && handlePopupClose()}
                    containerStyle={styles.buttonReject}
                  />
                  <FormButton
                    type="primary"
                    onPress={(): void => formProps.handleSubmit()}
                    containerStyle={styles.buttonAccept}
                    formProps={formProps}
                    title={t('updatePasswordWeb')}
                    disabled={!currentPassword && !newPassword}
                  />
                </View>
              </View>
            );
          }}
        </Formik>
      </>
    );
  };

  private handleSubmit = async (
    values: IChangePasswordForm,
    formActions: FormikHelpers<IChangePasswordForm>
  ): Promise<void> => {
    formActions.setSubmitting(true);
    const { currentPassword, newPassword } = values;
    const { t, handlePopupClose } = this.props;
    if (currentPassword === newPassword) {
      AlertHelper.error({ message: t('moreProfile:uniquePassword') });
      return;
    }

    const updatePayload: IUpdatePassword = {
      action: ResetPasswordTypes.UPDATE_PASSWORD,
      payload: {
        old_password: currentPassword,
        new_password: newPassword,
      },
    };

    try {
      await UserRepository.updatePassword(updatePayload);
      handlePopupClose();
    } catch (e: any) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private formSchema = (): yup.ObjectSchema<IChangePasswordForm> => {
    const { t } = this.props;
    return yup.object().shape({
      currentPassword: yup
        .string()
        .matches(FormUtils.passwordRegex, t('passwordValidation'))
        .min(6, t('minimumCharacters'))
        .required(t('passwordRequired')),
      newPassword: yup
        .string()
        .matches(FormUtils.passwordRegex, t('passwordValidation'))
        .min(6, t('minimumCharacters'))
        .required(t('passwordRequired')),
    });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.auth)(ChangePassword);

const styles = StyleSheet.create({
  formikView: {
    backgroundColor: theme.colors.white,
  },
  button: {
    marginTop: 30,
    flex: 0,
  },
  forgotText: {
    alignSelf: 'center',
    color: theme.colors.blue,
    marginTop: 20,
  },
  text: {
    paddingTop: 12,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    paddingLeft: 18,
  },
  closeButton: {
    position: 'absolute',
    right: 24,
    top: 12,
    cursor: 'pointer',
  },
  modalFooter: {
    marginTop: 18,
    marginHorizontal: '-16px',
    borderTopColor: theme.colors.divider,
    borderTopWidth: 1,
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: '74px',
  },
  buttonReject: {
    marginVertical: '16px',
  },
  buttonAccept: {
    marginVertical: '16px',
    marginHorizontal: '24px',
  },
});
