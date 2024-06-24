import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Formik, FormikProps, FormikValues } from 'formik';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { ISocietyFormData } from '@homzhub/common/src/modules/propertyPayment/interfaces';

interface IAddSocietyProps {
  onSubmitForm: () => void;
  isEditFlow?: boolean;
}

const AddSocietyForm = ({ onSubmitForm, isEditFlow = false }: IAddSocietyProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const formData = useSelector(PropertyPaymentSelector.getSocietyFormData);
  const societyId = useSelector(PropertyPaymentSelector.getSelectedSocietyId);

  useEffect(() => {
    if (societyId && isEditFlow) {
      dispatch(PropertyPaymentActions.getSocietyDetail({ societyId, isForUpdate: true }));
    }
  }, []);

  const formSchema = (): yup.ObjectSchema<ISocietyFormData> => {
    return yup.object().shape({
      projectName: yup.string(),
      propertyName: yup.string(),
      societyName: yup.string().required(),
      name: yup.string().required(),
      contactNumber: yup.string().required(),
      email: yup.string().email(t('auth:emailValidation')).required(t('auth:emailRequired')),
    });
  };

  const handleSubmit = (values: ISocietyFormData): void => {
    dispatch(PropertyPaymentActions.setSocietyFormData(values));
    onSubmitForm();
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={formData}
        enableReinitialize
        onSubmit={handleSubmit}
        validate={FormUtils.validate(formSchema)}
      >
        {(formProps: FormikProps<FormikValues>): React.ReactElement => {
          const { societyName, name, email, contactNumber } = formProps.values;
          const isEnable = !!societyName && !!name && !!email && !!contactNumber;
          return (
            <>
              <FormTextInput
                formProps={formProps}
                inputType="default"
                name="projectName"
                fontWeightType="semiBold"
                label={t('property:projectName')}
                editable={false}
              />
              <FormTextInput
                formProps={formProps}
                inputType="default"
                name="propertyName"
                fontWeightType="semiBold"
                label={t('property:propertyName')}
                editable={false}
              />
              <FormTextInput
                formProps={formProps}
                fontWeightType="semiBold"
                inputType="default"
                name="societyName"
                label={t('property:societyName')}
              />
              <Text type="small" textType="semiBold" style={styles.heading}>
                {t('property:societyContact')}
              </Text>
              <FormTextInput
                formProps={formProps}
                fontWeightType="semiBold"
                inputType="default"
                name="name"
                label={t('name')}
              />
              <FormTextInput
                formProps={formProps}
                fontWeightType="semiBold"
                inputType="phone"
                name="contactNumber"
                label={t('contactNumber')}
              />
              <FormTextInput
                formProps={formProps}
                fontWeightType="semiBold"
                inputType="email"
                name="email"
                label={t('emailId')}
              />
              <FormButton
                formProps={formProps}
                // @ts-ignore
                onPress={formProps.handleSubmit}
                type="primary"
                title={t('next')}
                disabled={!isEnable}
                containerStyle={styles.button}
              />
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default AddSocietyForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  heading: {
    marginTop: 16,
  },
  button: {
    marginVertical: 20,
  },
});
