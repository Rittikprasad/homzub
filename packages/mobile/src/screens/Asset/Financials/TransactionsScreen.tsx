import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import TransactionsList from '@homzhub/mobile/src/components/organisms/TransactionsList';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';

const TransactionsScreen = (): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const [loader, setLoader] = useState(false);
  const selectedProperty = useSelector(FinancialSelectors.getSelectedCountry);
  const selectedCountry = useSelector(FinancialSelectors.getSelectedCountry);
  const { ledgers: transactionsLoading } = useSelector(FinancialSelectors.getFinancialLoaders);
  const transactions = useSelector(FinancialSelectors.getTransactionRecords);

  useFocusEffect(
    useCallback(() => {
      dispatch(
        FinancialActions.getTransactions({
          offset: 0,
          limit: 10,
          asset_id: selectedProperty || undefined,
          country_id: selectedCountry || undefined,
        })
      );
    }, [])
  );

  return (
    <Screen
      backgroundColor={theme.colors.white}
      headerProps={{
        title: t('assetFinancial:transactions'),
        type: 'secondary',
        onIconPress: goBack,
      }}
      containerStyle={styles.container}
      isLoading={transactionsLoading || loader}
      scrollEnabled={false}
    >
      <TransactionsList toggleLoading={setLoader} transactionsList={transactions} />
    </Screen>
  );
};

export default React.memo(TransactionsScreen);

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});
