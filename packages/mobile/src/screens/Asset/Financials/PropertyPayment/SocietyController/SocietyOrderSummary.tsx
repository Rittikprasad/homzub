import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import ServiceOrderSummary from '@homzhub/common/src/components/organisms/ServiceOrderSummary';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const SocietyOrderSummary = (): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { navigate, goBack } = useNavigation();
  const { dueOrderSummary, payment } = useSelector(FinancialSelectors.getFinancialLoaders);

  const onSuccess = (): void => {
    navigate(ScreensKeys.PaymentServices, { isFromSummary: true });
  };

  const onGoBack = (): void => {
    dispatch(FinancialActions.clearOrderSummary());
    goBack();
  };

  return (
    <UserScreen
      loading={dueOrderSummary || payment}
      title={t('property:orderSummary')}
      pageTitle={t('property:payment')}
      onBackPress={onGoBack}
    >
      <ServiceOrderSummary onSuccess={onSuccess} />
    </UserScreen>
  );
};

export default SocietyOrderSummary;
