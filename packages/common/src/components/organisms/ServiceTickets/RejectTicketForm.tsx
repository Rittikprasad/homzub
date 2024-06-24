import React, { ReactElement, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IUpdateTicketWorkStatus, TicketAction } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  containerStyle?: ViewStyle;
  onSubmit?: () => void;
  toggleLoader: (loading: boolean) => void;
}

const RejectTIcketForm = (props: IProps): ReactElement => {
  const { containerStyle, onSubmit, toggleLoader } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  const [comment, setComment] = useState('');

  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);

  // HANDLERS

  const onFormSubmit = async (): Promise<void> => {
    try {
      if (selectedTicket) {
        toggleLoader(true);
        const requestBody: IUpdateTicketWorkStatus = {
          action: TicketAction.REJECT_TICKET,
          payload: {
            comment: comment.length > 0 ? comment : undefined,
          },
        };
        await TicketRepository.updateTicketStatusById(selectedTicket.ticketId, requestBody);
        toggleLoader(false);
        if (onSubmit) {
          onSubmit();
        }
        AlertHelper.success({ message: t('rejectRequestSuccess') });
      }
    } catch (e) {
      toggleLoader(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details.message), statusCode: e.details.statusCode });
    }
  };
  // HANDLERS

  return (
    <>
      <View style={[styles.container, containerStyle]}>
        <Text type="small" textType="semiBold">
          {t('rejectReason')}
        </Text>
        <Label type="large" style={styles.description}>
          {t('rejectTicketInfoText')}
        </Label>

        <TextArea
          value={comment}
          label={t('common:comment')}
          helpText={t('common:optional')}
          placeholder={t('common:typeComment')}
          wordCountLimit={450}
          onMessageChange={setComment}
          containerStyle={styles.commentBox}
        />
        <Button type="primary" title={t('common:reject')} onPress={onFormSubmit} />
      </View>
    </>
  );
};

export default React.memo(RejectTIcketForm);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    color: theme.colors.darkTint3,
    marginVertical: 12,
  },
  commentBox: {
    marginVertical: 20,
  },
});
