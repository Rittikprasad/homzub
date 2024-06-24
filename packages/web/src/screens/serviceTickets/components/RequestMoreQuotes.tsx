import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { theme } from '@homzhub/common/src/styles/theme';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { IRequestMorePayload, QuoteActions } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  category: ICategory;
  onSuccess: (message: string) => void;
}

interface ICategory {
  id: number;
  name: string;
}

const RequestMoreQuotes: React.FC<IProps> = (props: IProps) => {
  const { category, onSuccess } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const [moreComment, setMoreComment] = useState('');
  const onCommentChange = (value: string): void => {
    setMoreComment(value);
  };

  const handleCallback = (status: boolean): void => {
    if (status) {
      onSuccess(t('serviceTickets:moreQuoteSuccess'));
    }
  };

  const onSubmit = (): void => {
    if (selectedTicket) {
      const submitPayload: IRequestMorePayload = {
        param: {
          ticketId: selectedTicket.ticketId,
          quoteRequestId: selectedTicket.quoteRequestId,
        },
        data: {
          action: QuoteActions.REQUEST_MORE_QUOTE,
          payload: {
            quote_request_category: category.id,
            ...(!!moreComment && { comment: moreComment }),
          },
        },
        onCallback: handleCallback,
      };

      dispatch(TicketActions.requestMoreQuote(submitPayload));
    }
  };
  return (
    <View style={styles.container}>
      <View>
        <Label type="large">{t('serviceTickets:requestingMoreQuotes')}</Label>
        <View style={styles.chipView}>
          <Label type="large" textType="semiBold" style={styles.chipLabel}>
            {category.name}
          </Label>
        </View>
        <TextArea
          value={moreComment}
          wordCountLimit={450}
          label={t('common:comment')}
          helpText={t('common:optional')}
          placeholder={t('common:typeComment')}
          onMessageChange={onCommentChange}
          containerStyle={styles.commentBox}
        />
        <Button type="primary" title={t('common:submit')} onPress={onSubmit} containerStyle={styles.buttonContainer} />
      </View>
    </View>
  );
};

export default RequestMoreQuotes;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttonContainer: {
    marginTop: 10,
  },
  commentBox: {
    marginVertical: 10,
  },
  chipView: {
    backgroundColor: theme.colors.lightGrayishBlue,
    borderRadius: 20,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 10,
  },
  chipLabel: {
    color: theme.colors.primaryColor,
    textAlign: 'center',
  },
});
