import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { IDropdownOption, FormDropdown } from '@homzhub/common/src/components/molecules/FormDropdown';

interface IProps {
  isTerminate?: boolean;
  reasonData?: IDropdownOption[];
  closeModal: () => void;
  onSubmit: (payload: ICancelListingFormData) => void;
}
export interface ICancelListingFormData {
  reasonId: number;
  terminationDate: string;
  description: string;
  isTerminate: boolean;
}

const CancelTerminateListingForm: FC<IProps> = (props: IProps) => {
  const formData = {
    reasonId: 0,
    terminationDate: '',
    description: '',
    isTerminate: false,
  };
  const { t } = useTranslation();

  const { isTerminate = false, reasonData, closeModal } = props;

  const formSchema = (): yup.ObjectSchema<ICancelListingFormData> => {
    return yup.object().shape({
      isTerminate: yup.boolean(),
      isTouched: yup.boolean(),
      terminationDate: yup.string().when('isTerminate', {
        is: true,
        then: yup.string().required(t('moreProfile:fieldRequiredError')),
      }),
      reasonId: yup.number().required(t('moreProfile:fieldRequiredError')),
      description: yup.string(),
    });
  };

  const handleSubmit = (values: ICancelListingFormData): void => {
    const { onSubmit } = props;
    onSubmit(values);
  };

  return (
    <View style={styles.form}>
      <Formik onSubmit={handleSubmit} initialValues={{ ...formData }} validate={FormUtils.validate(formSchema)}>
        {(formProps: FormikProps<FormikValues>): React.ReactNode => {
          const { reasonId, terminationDate } = formProps.values;
          const isButtonEnable = isTerminate ? reasonId > 0 && !!terminationDate : reasonId > 0;
          const handleDescription = (value: string): void => {
            formProps.setFieldValue('description', value);
          };

          return (
            <>
              {reasonData && (
                <View style={styles.container}>
                  <FormDropdown
                    name="reasonId"
                    placeholder={t('common:reasonExample')}
                    label={t('common:reason')}
                    isMandatory
                    options={reasonData}
                    formProps={formProps}
                    dropdownContainerStyle={styles.dropdownStyle}
                  />
                </View>
              )}
              <View style={styles.container}>
                <TextArea
                  value={formProps.values.description}
                  placeholder={t('common:typeDescriptionHere')}
                  label={t('assetDescription:description')}
                  wordCountLimit={500}
                  containerStyle={styles.textArea}
                  inputContainerStyle={styles.innerText}
                  onMessageChange={handleDescription}
                />
              </View>

              <Divider containerStyles={styles.divider} />
              <View style={[styles.footer, styles.container]}>
                <FormButton
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  containerStyle={[styles.buttonDisable, isButtonEnable && styles.button]}
                  formProps={formProps}
                  disabled={!isButtonEnable}
                  type="primary"
                  title={t('common:submit')}
                />
                <FormButton
                  // @ts-ignore
                  onPress={closeModal}
                  containerStyle={styles.cancelButton}
                  formProps={formProps}
                  type="secondary"
                  title={t('common:cancel')}
                />
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default CancelTerminateListingForm;
const styles = StyleSheet.create({
  form: {
    marginTop: 16,
  },
  dropdownStyle: {
    paddingVertical: 12,
  },
  footer: {
    flexDirection: 'row-reverse',
    marginVertical: 16,
  },
  divider: {
    marginHorizontal: 0,
  },
  container: {
    marginHorizontal: 24,
  },
  textArea: {
    marginTop: 10,
  },
  innerText: {
    padding: 12,
    height: '100%',
  },
  cancelButton: {
    right: 16,
  },
  button: {
    backgroundColor: theme.colors.primaryColor,
  },
  buttonDisable: {
    backgroundColor: theme.colors.disabled,
  },
});
