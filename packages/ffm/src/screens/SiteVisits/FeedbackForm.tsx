import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FFMRepository } from '@homzhub/common/src/domain/repositories/FFMRepository';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import { FormDropdown } from '@homzhub/common/src/components/molecules/FormDropdown';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { IFeedbackParam } from '@homzhub/ffm/src/navigation/interfaces';
import { IFeedback } from '@homzhub/common/src/domain/repositories/interfaces';

enum OptionValue {
  YES = 'YES',
  NO = 'NO',
}

const options = [
  { label: 'Yes', value: OptionValue.YES },
  { label: 'No', value: OptionValue.NO },
];

interface IFormData {
  tenantInterested: string;
  tenantShortlisted: string;
  reason: number;
  negotiationRaised: number;
}

interface IFormTextArea {
  remark: string;
  requests: string;
}

const FeedbackForm = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const dispatch = useDispatch();
  const { params } = useRoute();
  const { t } = useTranslation();
  const reasons = useSelector(FFMSelector.getRejectionReason);
  const feedbackData = useSelector(FFMSelector.getFeedback);
  const [texAreaData, setTextAreaData] = useState<IFormTextArea>({
    requests: '',
    remark: '',
  });
  const [formData, setFormData] = useState<IFormData>({
    tenantInterested: '',
    tenantShortlisted: '',
    reason: 0,
    negotiationRaised: 0,
  });

  const { visitId, feedbackId, isSubmitted } = params as IFeedbackParam;

  useEffect(() => {
    if (feedbackId) {
      dispatch(FFMActions.getFeedback({ visitId, feedbackId }));
    }
    dispatch(FFMActions.getRejectionReasons(visitId));
  }, []);

  useEffect(() => {
    if (feedbackData) {
      setFormData({
        ...formData,
        reason: feedbackData.rejectReason?.id ?? 0,
        tenantInterested: feedbackData.isTenantInterested ? OptionValue.YES : OptionValue.NO,
        tenantShortlisted: feedbackData.isTenantShortlisted ? OptionValue.YES : OptionValue.NO,
        negotiationRaised: feedbackData.negotiationRaised ?? 0,
      });

      setTextAreaData({ ...texAreaData, requests: feedbackData.requests, remark: feedbackData.remarks });
    }
  }, [feedbackData]);

  const onChangeRequest = (value: string): void => {
    setTextAreaData({ ...texAreaData, requests: value });
  };

  const onChangeRemark = (value: string): void => {
    setTextAreaData({ ...texAreaData, remark: value });
  };

  const handleSubmit = async (values: IFormData): Promise<void> => {
    const { tenantShortlisted, tenantInterested, negotiationRaised, reason } = values;
    const isTenantInterested = tenantInterested === OptionValue.YES;
    const payload: IFeedback = {
      is_tenant_interested: isTenantInterested,
      is_tenant_shortlisted: tenantShortlisted === OptionValue.YES,
      ...(isTenantInterested && negotiationRaised > 0 && { negotiation_raised: negotiationRaised }),
      ...(isTenantInterested && texAreaData.requests && { requests: texAreaData.requests }),
      ...(texAreaData.remark && { remarks: texAreaData.remark }),
      reject_reason: !isTenantInterested ? reason : null,
    };

    try {
      await FFMRepository.postFeedback({ visitId, data: payload });
      AlertHelper.success({ message: t('siteVisits:feedbackSubmitted') });
      goBack();
    }catch (e: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  return (
    <GradientScreen
      isUserHeader
      screenTitle={t('property:siteVisits')}
      pageTitle={t('siteVisits:prospectFeedbackForm')}
      onGoBack={goBack}
    >
      <Formik initialValues={{ ...formData }} onSubmit={handleSubmit} enableReinitialize>
        {(formProps): React.ReactElement => {
          const { tenantInterested, tenantShortlisted, reason } = formProps.values;
          const isDisable =
            (tenantInterested === OptionValue.YES && !tenantShortlisted) ||
            (tenantInterested === OptionValue.NO && !reason);
          return (
            <ScrollView showsVerticalScrollIndicator={false}>
              <FormDropdown
                name="tenantInterested"
                label={t('siteVisits:tenantInterested')}
                placeholder={t('siteVisits:yesNo')}
                formProps={formProps}
                options={options}
                listHeight={300}
                isDisabled={isSubmitted}
                dropdownContainerStyle={styles.inputHeight}
              />
              {formProps.values.tenantInterested === OptionValue.YES && (
                <>
                  <FormDropdown
                    name="tenantShortlisted"
                    label={t('siteVisits:tenantShortlisted')}
                    placeholder={t('siteVisits:yesNo')}
                    formProps={formProps}
                    options={options}
                    listHeight={300}
                    isDisabled={isSubmitted}
                    dropdownContainerStyle={styles.inputHeight}
                  />
                  <FormTextInput
                    name="negotiationRaised"
                    inputType="number"
                    label={t('siteVisits:negotiationRaised')}
                    placeholder={t('siteVisits:offerRaised')}
                    formProps={formProps}
                    editable={!isSubmitted}
                  />
                  <TextArea
                    label={t('assetDashboard:tickets')}
                    placeholder={t('siteVisits:prospectRequest')}
                    isCountRequired={false}
                    value={texAreaData.requests}
                    onMessageChange={onChangeRequest}
                    isDisabled={isSubmitted}
                  />
                </>
              )}
              {formProps.values.tenantInterested === OptionValue.NO && (
                <FormDropdown
                  name="reason"
                  label={t('siteVisits:reasonRejection')}
                  placeholder={t('siteVisits:selectRejectionReason')}
                  formProps={formProps}
                  options={reasons}
                  dropdownContainerStyle={styles.inputHeight}
                  isDisabled={isSubmitted}
                />
              )}
              <TextArea
                label={t('remark')}
                helpText={t('optional')}
                placeholder={t('assetFinancial:notesPlaceholder')}
                value={texAreaData.remark}
                onMessageChange={onChangeRemark}
                containerStyle={styles.marginStyle}
                isDisabled={isSubmitted}
              />
              <FormButton
                disabled={isDisable || !tenantInterested || isSubmitted}
                formProps={formProps}
                // @ts-ignore
                onPress={formProps.handleSubmit}
                type="primary"
                title={t('submit')}
                containerStyle={styles.marginStyle}
              />
            </ScrollView>
          );
        }}
      </Formik>
    </GradientScreen>
  );
};

export default FeedbackForm;

const styles = StyleSheet.create({
  inputHeight: {
    height: 40,
  },
  marginStyle: {
    marginVertical: 16,
  },
});
