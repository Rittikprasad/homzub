import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { IUpdateWorkInfo } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
  onFormSubmitSuccess?: () => void;
  formData?: IWorkInfoForm;
  updateFormLoadingState: (isLoading: boolean) => void;
  handlePopupClose?: () => void;
}

interface IWorkInfoForm {
  name: string;
  email: string;
}

interface IState {
  workInfoForm: IWorkInfoForm;
}

export class WorkInfoForm extends React.PureComponent<IProps, IState> {
  public state = {
    workInfoForm: {
      name: '',
      email: '',
    },
  };

  public componentDidMount(): void {
    const { formData } = this.props;

    this.setState({
      workInfoForm: {
        name: (formData && formData.name) || '',
        email: (formData && formData.email) || '',
      },
    });
  }

  public render(): ReactElement {
    const { t, handlePopupClose } = this.props;
    const { workInfoForm } = this.state;

    return (
      <>
        <Formik
          onSubmit={this.onSubmit}
          initialValues={workInfoForm}
          validate={FormUtils.validate(this.formSchema)}
          enableReinitialize
        >
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            return (
              <>
                <View style={styles.container}>
                  <FormTextInput
                    name="name"
                    label={t('companyName')}
                    inputType="default"
                    placeholder={t('companyName')}
                    formProps={formProps}
                    isMandatory
                  />
                  <FormTextInput
                    name="email"
                    label={t('companyEmail')}
                    numberOfLines={1}
                    inputType="email"
                    placeholder={t('companyEmail')}
                    formProps={formProps}
                    isMandatory
                  />
                </View>
                {!PlatformUtils.isWeb() ? (
                  <FormButton
                    formProps={formProps}
                    // @ts-ignore
                    onPress={formProps.handleSubmit}
                    type="primary"
                    title={t('saveChanges')}
                    containerStyle={styles.buttonStyle}
                  />
                ) : (
                  <View style={styles.modalFooter}>
                    <FormButton
                      formProps={formProps}
                      title={t('common:cancel')}
                      type="secondary"
                      onPress={(): void => handlePopupClose && handlePopupClose()}
                      containerStyle={styles.buttonReject}
                    />
                    <FormButton
                      formProps={formProps}
                      title={t('moreProfile:saveChanges')}
                      type="primary"
                      onPress={(): void => formProps.handleSubmit()}
                      containerStyle={styles.buttonAccept}
                    />
                  </View>
                )}
              </>
            );
          }}
        </Formik>
      </>
    );
  }

  private onSubmit = async (values: IWorkInfoForm, formikHelpers: FormikHelpers<IWorkInfoForm>): Promise<void> => {
    const { onFormSubmitSuccess, updateFormLoadingState, handlePopupClose } = this.props;
    formikHelpers.setSubmitting(true);

    const payload: IUpdateWorkInfo = {
      company_name: values.name,
      work_email: values.email,
    };

    try {
      updateFormLoadingState(true);
      await UserRepository.updateWorkInfo(payload);

      formikHelpers.setSubmitting(false);
      updateFormLoadingState(false);

      if (onFormSubmitSuccess) {
        if (PlatformUtils.isWeb() && handlePopupClose) {
          handlePopupClose();
        }
        onFormSubmitSuccess();
        if (PlatformUtils.isWeb() && handlePopupClose) {
          handlePopupClose();
        }
      }
    }catch (e: any) {      if (PlatformUtils.isWeb() && handlePopupClose) {
        handlePopupClose();
      }
      updateFormLoadingState(false);
      formikHelpers.setSubmitting(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  private formSchema = (): yup.ObjectSchema<IWorkInfoForm> => {
    const { t } = this.props;

    return yup.object().shape({
      name: yup.string().required(t('fieldRequiredError')),
      email: yup.string().required(t('fieldRequiredError')),
    });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.moreProfile)(WorkInfoForm);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
  modalFooter: {
    marginHorizontal: '-16px',
    marginBottom: '-24px',
    borderTopColor: theme.colors.divider,
    borderTopWidth: 1,
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: '76px',
  },
  buttonReject: {
    marginVertical: '16px',
  },
  buttonAccept: {
    marginVertical: '16px',
    marginHorizontal: '24px',
  },
});
