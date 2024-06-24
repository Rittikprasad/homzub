import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
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

  const handleBack = (): void => {
    dispatch(TicketActions.setQuotes([]));
    goBack();
  };

  // HANDLERS

  const renderScreen = (children: ReactElement): ReactElement => {
    return (
      <GradientScreen
        isUserHeader
        isScrollable
        onGoBack={handleBack}
        pageTitle={t('submitQuote')}
        screenTitle={selectedTicket?.propertyName ?? ''}
        loading={quotesCategory || isLoading || submitQuote}
      >
        {children}
      </GradientScreen>
    );
  };

  return <QuoteSubmit renderScreen={renderScreen} handleGoBack={handleBack} setLoading={setLoading} />;
};

export default SubmitQuote;
