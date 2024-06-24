import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import QuotePreview from '@homzhub/common/src/components/molecules/QuotePreview';
import { RequestedQuote } from '@homzhub/common/src/domain/models/RequestedQuote';
import { IQuoteApprovePayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICollapseSection } from '@homzhub/common/src/constants/ServiceTickets';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  onSuccess: () => void;
  onOpenQuote: (url: string) => void;
  onRequestMore: (categoryId: number, name: string) => void;
  renderCollapsibleSection: (data: ICollapseSection) => React.ReactElement;
}

const ApproveQuoteForm = (props: IProps): React.ReactElement => {
  const { renderCollapsibleSection, onSuccess, onOpenQuote, onRequestMore } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const quotes = useSelector(TicketSelectors.getQuoteRequests);
  const [selectedQuote, setSelectedQuote] = useState<number[]>([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (selectedTicket) {
      dispatch(
        TicketActions.getQuoteRequests({
          ticketId: selectedTicket.ticketId,
          quoteRequestId: selectedTicket.quoteRequestId,
        })
      );
    }
  }, []);

  // HANDLERS START

  const onSubmit = (): void => {
    if (selectedTicket) {
      const payload: IQuoteApprovePayload = {
        param: { ticketId: selectedTicket.ticketId },
        data: {
          quotes: selectedQuote,
          ...(!!comment && { comment }),
        },
      };

      dispatch(TicketActions.approveQuote({ data: payload, onCallback: handleCallback }));
    }
  };

  const onSelectQuote = (id: number, index: number): void => {
    const updateQuote = [...selectedQuote];
    updateQuote[index] = id;
    setSelectedQuote(updateQuote);
  };

  const onCommentChange = (value: string): void => {
    setComment(value);
  };

  const handleCallback = (status: boolean): void => {
    if (status) {
      onSuccess();
    }
  };

  // HANDLERS END

  const renderPreview = (item: RequestedQuote, index: number): React.ReactElement => {
    return (
      <QuotePreview
        detail={item.users}
        selectedQuote={selectedQuote[index]}
        onSelectQuote={(id): void => onSelectQuote(id, index)}
        onOpenQuote={onOpenQuote}
        onRequestMore={(): void => onRequestMore(item.id, item.name)}
      />
    );
  };
  return (
    <View style={styles.container}>
      <Text type="small" textType="semiBold">
        {t('submittedQuotes')}
      </Text>
      <Label type="large" style={styles.description}>
        {t('approveQuoteDescription')}
      </Label>
      {quotes.length > 0 &&
        quotes.map((item, index) => {
          return renderCollapsibleSection({ children: renderPreview(item, index), title: item.name });
        })}
      <TextArea
        value={comment}
        label={t('common:comment')}
        helpText={t('common:optional')}
        placeholder={t('common:typeComment')}
        wordCountLimit={450}
        onMessageChange={onCommentChange}
        containerStyle={styles.commentBox}
      />
      <Button type="primary" title={t('common:accept')} disabled={!selectedQuote.length} onPress={onSubmit} />
    </View>
  );
};

export default ApproveQuoteForm;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    color: theme.colors.darkTint3,
    marginVertical: 12,
  },
  cardContainer: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: theme.colors.disabled,
    paddingVertical: 12,
  },
  cardTitle: {
    color: theme.colors.darkTint2,
    paddingHorizontal: 16,
  },
  iconStyle: {
    paddingHorizontal: 16,
  },
  commentBox: {
    marginVertical: 20,
  },
});
