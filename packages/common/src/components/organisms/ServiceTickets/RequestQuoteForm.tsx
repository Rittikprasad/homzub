import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { RNSwitch } from '@homzhub/common/src/components/atoms/Switch';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import ChipField from '@homzhub/common/src/components/molecules/ChipField';
import InputGroup from '@homzhub/common/src/components/molecules/InputGroup';
import { IQuoteRequestParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  onSuccess: () => void;
}

const RequestQuoteForm = ({ onSuccess }: IProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const dispatch = useDispatch();

  const [emails, setEmails] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [invite, setInvite] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [error, setIsError] = useState({
    isEmail: false,
    isCategory: false,
  });

  const onUpdateEmails = (values: string[]): void => {
    setEmails(values);
  };

  const updateEmailError = (value: boolean): void => {
    setIsError({ ...error, isEmail: value });
  };

  const updateCategoryError = (value: boolean): void => {
    setIsError({ ...error, isCategory: value });
  };

  const onSetCategories = (values: string[]): void => {
    setCategories(values);
  };

  const onSubmit = (): void => {
    if (selectedTicket) {
      const payload: IQuoteRequestParam = {
        quote_request_categories: categories,
        is_homzhub_partner_invited: invite,
        emails,
        ...(!!comment && { comment }),
      };
      dispatch(
        TicketActions.requestQuote({
          ticketId: selectedTicket.ticketId,
          payload,
          onCallback: handleCallback,
        })
      );
    }
  };

  const handleCallback = (status: boolean): void => {
    if (status) {
      onSuccess();
    }
  };

  const isDisable = !invite && (emails.length < 1 || error.isEmail);

  return (
    <View style={styles.container}>
      <Text type="small" textType="semiBold">
        {t('requestForQuote')}
      </Text>
      <Label type="large" style={styles.description}>
        {t('requestDescription')}
      </Label>
      <ChipField
        label={t('assetFinancial:category')}
        placeholder={t('ticketCategory')}
        chipColor={theme.colors.primaryColor}
        onSetValue={onSetCategories}
        setValueError={updateCategoryError}
        valueLimit={20}
        totalChips={5}
      />
      <View style={styles.switchContainer}>
        <Text type="small" textType="semiBold">
          {t('invitePartner')}
        </Text>
        <RNSwitch selected={invite} onToggle={setInvite} />
      </View>
      <InputGroup
        data={emails}
        label={t('inviteMorePartner')}
        placeholder={t('auth:enterEmailText')}
        buttonLabel={t('vendorEmail')}
        updateData={onUpdateEmails}
        isEmailField
        updateError={updateEmailError}
        addButtonDeviceStyle={styles.verticalStyle}
        inputContainer={styles.inputContainer}
      />
      <TextArea
        value={comment}
        label={t('common:comments')}
        helpText={t('common:optional')}
        placeholder={t('common:typeComment')}
        onMessageChange={setComment}
        containerStyle={styles.verticalStyle}
      />
      <Button
        type="primary"
        title={t('sendRequest')}
        disabled={error.isCategory || categories.length < 1 || isDisable}
        onPress={onSubmit}
      />
    </View>
  );
};

export default RequestQuoteForm;

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verticalStyle: {
    marginVertical: 10,
  },
  inputContainer: {
    marginTop: 10,
  },
  description: {
    marginTop: 6,
    color: theme.colors.darkTint3,
  },
});
