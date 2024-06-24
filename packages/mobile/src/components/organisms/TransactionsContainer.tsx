import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import SectionContainer from '@homzhub/common/src/components/organisms/SectionContainer';
import TransactionsList from '@homzhub/mobile/src/components/organisms/TransactionsList';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const PAGE_LIMIT = 10;

interface IProps {
  toggleLoader: (loader: boolean) => void;
  isFromPortfolio: boolean;
}

const TransactionsContainer = ({ toggleLoader, isFromPortfolio }: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const selectedProperty = useSelector(FinancialSelectors.getSelectedProperty);
  const selectedCountry = useSelector(FinancialSelectors.getSelectedCountry);
  const transactions = useSelector(FinancialSelectors.getTransactionRecords);

  const fetchTransactions = (): void => {
    dispatch(
      FinancialActions.getTransactions({
        offset: 0,
        limit: PAGE_LIMIT,
        asset_id: selectedProperty || undefined,
        country_id: selectedCountry || undefined,
      })
    );
  };

  // Call API when screen gets focused
  useFocusEffect(
    React.useCallback(() => {
      fetchTransactions();
    }, [])
  );

  // Call API when filters are applied
  useEffect(() => {
    fetchTransactions();
  }, [selectedCountry, selectedProperty]);

  const onViewAll = (): void => {
    navigate(ScreensKeys.TransactionsScreen);
  };

  return (
    <SectionContainer
      sectionTitle={t('assetFinancial:transactions')}
      sectionIcon={icons.cheque}
      containerStyle={styles.container}
      onPressRightContent={onViewAll}
      rightIcon={transactions.length > 3 ? icons.list : undefined}
      rightIconColor={theme.colors.dark}
      showSectionHeader={!isFromPortfolio}
    >
      <TransactionsList
        toggleLoading={toggleLoader}
        transactionsList={isFromPortfolio ? transactions : transactions.slice(0, 3)}
      />
    </SectionContainer>
  );
};

export default React.memo(TransactionsContainer);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: theme.colors.white,
  },
});
