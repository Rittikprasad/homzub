import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import QuoteSubmit from '@homzhub/mobile/src/screens/Asset/More/ServiceTickets/components/QuoteSubmit';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const SubmitQuote = (): ReactElement => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const { quotesCategory, submitQuote } = useSelector(TicketSelectors.getTicketLoaders);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const [isLoading, setLoading] = useState(false);

  // HANDLERS

  const onBack = (): void => {
    dispatch(TicketActions.setQuotes([]));
    goBack();
  };

  // HANDLERS

  const renderScreen = (children: ReactElement): ReactElement => {
    return (
      <UserScreen
        title={selectedTicket?.propertyName ?? ''}
        pageTitle={t('submitQuote')}
        onBackPress={onBack}
        keyboardShouldPersistTaps
        loading={quotesCategory || isLoading || submitQuote}
      >
        {children}
      </UserScreen>
    );
  };

  return <QuoteSubmit renderScreen={renderScreen} handleGoBack={onBack} setLoading={setLoading} />;
};

export default SubmitQuote;
