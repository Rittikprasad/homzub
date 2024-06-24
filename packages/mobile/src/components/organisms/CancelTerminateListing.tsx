import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Formik, FormikProps, FormikValues } from 'formik';
import { WithTranslation, withTranslation } from 'react-i18next';
import * as yup from 'yup';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';

export interface ISubmitPayload extends IFormData {
  isTerminate: boolean;
  description: string;
}

export interface IFormData {
  reasonId: number;
  terminationDate: string;
}

interface IScreenState {
  formData: IFormData;
  description: string;
  isTouched: boolean;
}

interface IProps {
  isTerminate?: boolean;
  leaseEndDate?: string;
  onFormEdit: () => void;
  reasonData: IDropdownOption[];
  onSubmit: (payload: ISubmitPayload) => void;
}

type Props = IProps & WithTranslation;

class CancelTerminateListing extends Component<Props, IScreenState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      formData: {
        reasonId: 0,
        terminationDate: '',
      },
      description: '',
      isTouched: false,
    };
  }

  public render(): React.ReactNode {
    const { formData, description, isTouched } = this.state;
    const { t, isTerminate = false, onFormEdit, reasonData, leaseEndDate } = this.props;

    return (
      <View style={styles.form}>
        <Formik
          onSubmit={this.handleSubmit}
          initialValues={{ ...formData }}
          validate={FormUtils.validate(this.formSchema)}
        >
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            const { reasonId, terminationDate } = formProps.values;
            const isButtonEnable = isTerminate ? reasonId > 0 && !!terminationDate : reasonId > 0;

            if (!isTouched && formProps.dirty) {
              this.setState({ isTouched: true });
              onFormEdit();
            }

            return (
              <>
                <FormDropdown
                  name="reasonId"
                  placeholder={t('common:reasonExample')}
                  label={t('common:reason')}
                  isMandatory
                  options={reasonData}
                  formProps={formProps}
                  dropdownContainerStyle={styles.dropdownStyle}
                />
                {isTerminate && (
                  <FormCalendar
                    formProps={formProps}
                    isCurrentDateEnable
                    maxDate={leaseEndDate && DateUtils.getUtcFormatted(leaseEndDate, DateFormats.DD_MM_YYYY)}
                    name="terminationDate"
                    textType="label"
                    label={t('property:terminationDate')}
                    calendarTitle={t('property:selectMoveOutDate')}
                    placeHolder={t('property:selectMoveOutDate')}
                    isMandatory
                  />
                )}
                <TextArea
                  value={description}
                  placeholder={t('common:typeDescriptionHere')}
                  label={t('assetDescription:description')}
                  wordCountLimit={500}
                  containerStyle={styles.textArea}
                  onMessageChange={this.handleDescription}
                />
                <Label type="large" style={styles.message}>
                  {t('common:actionNotDone')}
                </Label>
                <FormButton
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  containerStyle={{ backgroundColor: isButtonEnable ? theme.colors.error : theme.colors.disabled }}
                  formProps={formProps}
                  disabled={!isButtonEnable}
                  type="primary"
                  title={isTerminate ? t('common:sendNotice') : t('property:deleteListing')}
                />
              </>
            );
          }}
        </Formik>
      </View>
    );
  }

  private handleDescription = (value: string): void => {
    this.setState({ description: value });
  };

  private formSchema = (): yup.ObjectSchema<IFormData> => {
    const { t } = this.props;

    return yup.object().shape({
      terminationDate: yup.string().when('isTerminate', {
        is: true,
        then: yup.string().required(t('moreProfile:fieldRequiredError')),
      }),
      reasonId: yup.number().required(t('moreProfile:fieldRequiredError')),
    });
  };

  private handleSubmit = (values: IFormData): void => {
    const { onSubmit, isTerminate } = this.props;
    const { description } = this.state;
    onSubmit({ ...values, isTerminate: isTerminate ?? false, description });
  };
}

export default withTranslation()(CancelTerminateListing);

const styles = StyleSheet.create({
  form: {
    paddingVertical: 14,
  },
  dropdownStyle: {
    paddingVertical: 12,
  },
  textArea: {
    marginTop: 10,
    marginBottom: 50,
  },
  message: {
    alignSelf: 'center',
    color: theme.colors.darkTint5,
    marginVertical: 12,
  },
});
