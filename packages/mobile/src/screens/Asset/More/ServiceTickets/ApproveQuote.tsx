import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { CollapsibleSection } from '@homzhub/mobile/src/components';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import ApproveQuoteForm from '@homzhub/common/src/components/organisms/ServiceTickets/ApproveQuoteForm';
import { IRequestMorePayload, QuoteActions } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICollapseSection } from '@homzhub/common/src/constants/ServiceTickets';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const ApproveQuote = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const dispatch = useDispatch();
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const { quoteRequests, approveQuote } = useSelector(TicketSelectors.getTicketLoaders);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const [category, setCategory] = useState({
    id: 0,
    name: '',
  });
  const [isRequestMore, setRequestMore] = useState(false);
  const [moreComment, setMoreComment] = useState('');

  // HANDLERS START

  const onOpenQuote = async (url: string): Promise<void> => {
    if (!(await LinkingService.canOpenURL(url))) {
      AlertHelper.error({ message: t('common:invalidLinkError') });
    }

    await LinkingService.canOpenURL(url);
  };

  const onRequestMore = (id: number, name: string): void => {
    setCategory({ id, name });
    setRequestMore(true);
  };

  const onCloseSheet = (): void => {
    setRequestMore(false);
  };

  const onCommentChange = (value: string): void => {
    setMoreComment(value);
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

  const handleCallback = (status: boolean): void => {
    setRequestMore(false);
    if (status) {
      AlertHelper.success({ message: t('moreQuoteSuccess') });
    }
    goBack();
  };

  // HANDLERS END

  const renderCollapsibleSection = (data: ICollapseSection): React.ReactElement => {
    return (
      <CollapsibleSection
        title={t(data.title)}
        collapseIcon={icons.upArrow}
        expandIcon={icons.downArrow}
        containerStyle={styles.cardContainer}
        titleStyle={styles.cardTitle}
        iconStyle={styles.iconStyle}
      >
        {data.children}
      </CollapsibleSection>
    );
  };

  return (
    <>
      <UserScreen
        title={selectedTicket?.propertyName ?? ''}
        pageTitle={t('approveQuote')}
        onBackPress={goBack}
        keyboardShouldPersistTaps
        loading={quoteRequests || approveQuote}
      >
        <ApproveQuoteForm
          renderCollapsibleSection={renderCollapsibleSection}
          onSuccess={goBack}
          onOpenQuote={onOpenQuote}
          onRequestMore={onRequestMore}
        />
      </UserScreen>
      <BottomSheet
        visible={isRequestMore}
        onCloseSheet={onCloseSheet}
        headerTitle={t('moreQuotes')}
        sheetContainerStyle={styles.container}
        sheetHeight={theme.viewport.height * 0.6}
      >
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <Label type="large">{t('requestingMoreQuotes')}</Label>
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
          <Button
            type="primary"
            title={t('common:submit')}
            onPress={onSubmit}
            containerStyle={styles.buttonContainer}
          />
        </KeyboardAwareScrollView>
      </BottomSheet>
    </>
  );
};

export default ApproveQuote;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttonContainer: {
    marginTop: 10,
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
