import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import DuesCard from '@homzhub/web/src/screens/financials/Dues/DuesCard';
import { DueItem } from '@homzhub/common/src/domain/models/DueItem';

const DuesContainer = (): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const dueItems: DueItem[] = useSelector(FinancialSelectors.getDueItems);
  const TOTAL_DUE_AMOUNT = useSelector(FinancialSelectors.getTotalDueAmount);
  const { dues: dueLoading, deleteDue } = useSelector(FinancialSelectors.getFinancialLoaders);
  const {
    amount,
    currency: { currencySymbol },
  } = TOTAL_DUE_AMOUNT;
  useEffect(() => {
    dispatch(FinancialActions.getDues());
  }, []);
  return (
    <View style={styles.container}>
      <Loader visible={dueLoading || deleteDue} />
      <View style={styles.header}>
        <View style={styles.leftChild}>
          <Icon name={icons.wallet} size={22} color={theme.colors.darkTint3} />
          <Text type="small" textType="semiBold" style={styles.text}>
            {t('assetDashboard:dues')}
          </Text>
        </View>
        <Text type="small" textType="semiBold" style={styles.amount}>
          {currencySymbol} {amount}
        </Text>
      </View>
      <ScrollView>
        {dueItems.length ? dueItems.map((item) => <DuesCard key={item.id} dueItem={item} />) : <EmptyState />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    padding: 15,
    height: 350,
  },
  amount: {
    marginRight: 10,
    color: theme.colors.error,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  leftChild: {
    flexDirection: 'row',
  },
  text: { marginLeft: 10, color: theme.colors.darkTint1 },
});
export default DuesContainer;
