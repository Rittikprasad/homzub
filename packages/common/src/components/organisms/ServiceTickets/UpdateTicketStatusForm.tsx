import React, { ReactElement } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IUpdateTicketWorkStatus, TicketAction } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  containerStyle?: ViewStyle;
  onSubmit?: () => void;
  toggleLoader: (loader: boolean) => void;
  isLoading?: boolean;
}

interface IUpdateTicketForm {
  updateTitle: string;
  description: string;
}

const initialFormValues: IUpdateTicketForm = {
  updateTitle: '',
  description: '',
};

const UpdateTicketStatusForm = (props: IProps): ReactElement => {
  const { containerStyle, toggleLoader, onSubmit, isLoading } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);

  // HANDLERS

  const onFormSubmit = async (values: IUpdateTicketForm): Promise<void> => {
    try {
      if (selectedTicket) {
        const { updateTitle, description } = values;
        toggleLoader(true);
        const requestBody: IUpdateTicketWorkStatus = {
          action: TicketAction.WORK_UPDATE,
          payload: {
            title: updateTitle,
            comment: description,
          },
        };
        await TicketRepository.updateTicketStatusById(selectedTicket.ticketId, requestBody);
        toggleLoader(false);
        if (onSubmit) {
          onSubmit();
        }
        AlertHelper.success({ message: t('updateSentSuccess') });
      }
    }catch (e: any) {      toggleLoader(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details.message), statusCode: e.details.statusCode });
    }
  };

  const validateForm = (): yup.ObjectSchema => {
    return yup.object().shape({
      updateTitle: yup.string().required(t('moreProfile:fieldRequiredError')),
      description: yup.string().required(t('moreProfile:fieldRequiredError')),
    });
  };
  // HANDLERS

  const UpdateTicketStatusFormik = (): React.ReactElement => {
    return (
      <Formik
        onSubmit={onFormSubmit}
        initialValues={initialFormValues}
        enableReinitialize
        validate={FormUtils.validate(validateForm)}
      >
        {(formProps: FormikProps<IUpdateTicketForm>): React.ReactElement => {
          const {
            values: { updateTitle, description },
          } = formProps;
          const isDisabled = !updateTitle.length || !description.length;
          return (
            <>
              <FormTextInput
                name="updateTitle"
                inputType="default"
                formProps={formProps}
                label={t('updateTitle')}
                maxLength={40}
              />
              <FormTextInput
                name="description"
                inputType="default"
                formProps={formProps}
                label={t('assetDescription:description')}
                numberOfLines={4}
                placeholder={t('common:typeComment')}
                placeholderTextColor={theme.colors.darkTint8}
                style={styles.textArea}
                multiline
                maxLength={450}
              />
              <FormButton
                // @ts-ignore
                onPress={formProps.handleSubmit}
                formProps={formProps}
                disabled={isLoading || isDisabled}
                title={t('sendUpdate')}
                containerStyle={styles.button}
              />
            </>
          );
        }}
      </Formik>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text type="small" textType="semiBold">
        {t('updates')}
      </Text>
      <Label type="large" style={styles.description}>
        {t('updateWorkProgressInfoText')}
      </Label>
      <UpdateTicketStatusFormik />
    </View>
  );
};

export default React.memo(UpdateTicketStatusForm);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    color: theme.colors.darkTint3,
    marginVertical: 12,
  },
  button: {
    marginVertical: 30,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingLeft: 10,
  },
});
