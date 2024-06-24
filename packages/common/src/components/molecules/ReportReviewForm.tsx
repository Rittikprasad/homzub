import React, { ReactElement } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IOwnProps extends WithTranslation {
  reviewId: number;
  onSuccessFullSubmit?: () => void;
  onFormCancellation: () => void;
  reportCategories: Unit[];
}

interface IFormData {
  reason: number;
  message?: string;
}

interface IOwnState {
  formData: IFormData;
}

class ReportReviewForm extends React.PureComponent<IOwnProps, IOwnState> {
  public state = {
    formData: {
      reason: -1,
      message: '',
    },
  };

  public render(): ReactElement {
    const { t, onFormCancellation } = this.props;
    const { formData } = this.state;

    return (
      <KeyboardAwareScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Label type="large" style={styles.labelStyle}>
          {t('inappropriateMessage')}
        </Label>
        <Formik<IFormData>
          onSubmit={this.onSubmit}
          initialValues={{ ...formData }}
          validate={FormUtils.validate(this.formSchema)}
        >
          {(formProps: FormikProps<IFormData>): React.ReactNode => {
            const setMessage = (text: string): void => {
              formProps.setFieldValue('message', text);
            };
            return (
              <>
                <FormDropdown
                  formProps={formProps}
                  name="reason"
                  options={this.loadReportCategories()}
                  placeholder={t('selectYourReason')}
                  isMandatory
                  label={t('common:reason')}
                  listHeight={theme.viewport.height * 0.8}
                  textSize="small"
                  textType="text"
                  fontType="semiBold"
                />
                <TextArea
                  label={t('tellUsMore')}
                  helpText={t('common:optional')}
                  onMessageChange={setMessage}
                  value={formProps.values.message || ''}
                  wordCountLimit={200}
                  placeholder={t('tellUsMorePlaceholder')}
                  textAreaStyle={styles.textArea}
                  containerStyle={styles.textAreaContainer}
                />
                <View style={styles.buttonContainer}>
                  <Button
                    // @ts-ignore
                    onPress={onFormCancellation}
                    type="secondary"
                    title={t('common:cancel')}
                    containerStyle={!PlatformUtils.isWeb() && styles.buttonStyle}
                  />
                  <FormButton
                    // @ts-ignore
                    onPress={formProps.handleSubmit}
                    disabled={formProps.values.reason < 0}
                    formProps={formProps}
                    type="primary"
                    title={t('common:report')}
                    containerStyle={!PlatformUtils.isWeb() && styles.buttonStyle}
                  />
                </View>
              </>
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    );
  }

  private onSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
    const { onSuccessFullSubmit, reviewId } = this.props;
    const { reason, message } = values;

    formActions.setSubmitting(true);
    try {
      const payload = {
        category: reason,
        ...(message && { report_comment: message }),
      };

      await AssetRepository.reportReview(reviewId, payload);
      if (onSuccessFullSubmit) {
        onSuccessFullSubmit();
      }
    } catch (error) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(error.details) });
    } finally {
      formActions.setSubmitting(false);
    }
  };

  private loadReportCategories = (): IDropdownOption[] => {
    const { reportCategories } = this.props;
    return reportCategories.map((category) => {
      return {
        value: category.id,
        label: category.label,
      };
    });
  };

  private formSchema = (): yup.ObjectSchema<IFormData> => {
    const { t } = this.props;
    return yup.object().shape({
      reason: yup.number().required(t('reportingReasonRequired')),
      message: yup.string().optional(),
    });
  };
}
const namespace = LocaleConstants.namespacesKey;
export default withTranslation([namespace.property])(ReportReviewForm);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: 24,
  },
  textArea: {
    height: 200,
    borderRadius: 4,
  },
  textAreaContainer: {
    marginTop: 30,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  buttonStyle: {
    flex: 0,
  },
  labelStyle: {
    marginTop: 24,
    marginBottom: 20,
  },
});
