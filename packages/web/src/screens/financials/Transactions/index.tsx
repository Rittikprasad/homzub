import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import PrevNextPagination from '@homzhub/web/src/components/hoc/PrevNextPagination';
import TransactionAccordian from '@homzhub/web/src/screens/financials/Transactions/TransactionAccordian';
import { FinancialRecords } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ITransactionParams } from '@homzhub/common/src/domain/repositories/interfaces';

interface IReduxState {
  transactionsData: FinancialRecords[];
  transactionsCount: number;
  selectedProperty: number;
  selectedCountry: number;
  transactionsLoading: boolean;
}

interface IDispatchProps {
  getTransactions: (payload: ITransactionParams) => void;
  getLedgerMetrics: () => void;
}

interface IProps {
  onOpenModal: (isEdit: boolean, transactionId: number) => void;
  isAddRecord: boolean;
  onDeleteRecord: (currentTransactionId: number) => void;
}

type Props = IReduxState & IDispatchProps & IProps;

const Transactions = (props: Props): React.ReactElement<Props> => {
  const { t } = useTranslation();
  const {
    selectedCountry,
    selectedProperty,
    onDeleteRecord,
    getTransactions,
    transactionsData,
    transactionsCount,
    isAddRecord,
    onOpenModal,
    transactionsLoading,
  } = props;

  const [currOffset, setCurrOffset] = useState(0);
  const [transactionsArray, setTransactionsArray] = useState(transactionsData);
  const limit = 3;
  const hasMore = transactionsCount > currOffset;

  useEffect(() => {
    getGeneralLedgers(true);
  }, [selectedCountry, selectedProperty]);

  const getGeneralLedgers = (reset = false): void => {
    getTransactions({
      offset: reset ? 0 : transactionsData.length,
      limit: 3,
      asset_id: selectedProperty || undefined,
      country_id: selectedCountry || undefined,
    });
  };

  useEffect(() => {
    if (transactionsData.length === limit) {
      setTransactionsArray(transactionsData);
    }
  }, [transactionsData]);

  useEffect(() => {
    setTransactionsArray(transactionsData.splice(currOffset - limit, currOffset));
  }, [currOffset]);

  const fetchMoreData = (updatedOffset: number, isNext: boolean): void => {
    if (isNext) {
      getTransactions({
        offset: updatedOffset,
        limit: 3,
        asset_id: selectedProperty || undefined,
        country_id: selectedCountry || undefined,
      });
    }
    setCurrOffset(updatedOffset);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Icon name={icons.wallet} size={22} color={theme.colors.darkTint3} />
          <Text type="small" textType="semiBold" style={styles.text}>
            {t('assetDashboard:Transaction')}
          </Text>
        </View>
        {isAddRecord && (
          <Button
            type="secondary"
            title={t('assetFinancial:addNewRecord')}
            containerStyle={styles.addRecordButton}
            onPress={(): void => onOpenModal(false, -1)}
          />
        )}
      </View>
      <PrevNextPagination
        isPrevDisabled={currOffset === 0}
        isNextDisabled={currOffset >= transactionsCount}
        hasMore={hasMore}
        limit={limit}
        loader={transactionsLoading}
        fetchMoreData={fetchMoreData}
      >
        {transactionsArray.length ? (
          transactionsArray.map((item) => (
            <TransactionAccordian
              key={item.id}
              transactionItem={item}
              onAddRecord={onOpenModal}
              onDeleteRecord={onDeleteRecord}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </PrevNextPagination>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    padding: 15,
    height: 600,
  },
  amount: {
    marginRight: 10,
    color: theme.colors.error,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  header: {
    flexDirection: 'row',
  },
  leftChild: {
    flexDirection: 'row',
  },
  text: { marginLeft: 10, color: theme.colors.darkTint1 },
  addRecordButton: {
    flex: 1,
    borderStyle: 'dashed',
    maxWidth: 200,
    marginTop: -10,
  },
});
const mapStateToProps = (state: IState): IReduxState => {
  const { getTransactionRecords, getTransactionsCount, getSelectedCountry, getSelectedProperty } = FinancialSelectors;
  return {
    transactionsData: getTransactionRecords(state),
    transactionsCount: getTransactionsCount(state),
    selectedCountry: getSelectedCountry(state),
    selectedProperty: getSelectedProperty(state),
    transactionsLoading: state.financials.loaders.transactions,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getTransactions, getLedgerMetrics } = FinancialActions;
  return bindActionCreators({ getTransactions, getLedgerMetrics }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
