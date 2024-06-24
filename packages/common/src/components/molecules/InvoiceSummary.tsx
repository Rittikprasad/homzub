import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { IListData } from '@homzhub/common/src/domain/models/Asset';
import { DueOrderSummary } from '@homzhub/common/src/domain/models/DueOrderSummary';

interface IProps {
  summary: DueOrderSummary;
}

const InvoiceSummary = ({ summary }: IProps): React.ReactElement => {
  const keyExtractor = (item: IListData, index: number): string => `${item.label}[${index}]`;

  const renderItem = ({ item }: { item: IListData }): React.ReactElement => (
    <View style={styles.itemsContainer}>
      <Text type="small" textType={item.isTitle ? 'semiBold' : 'regular'} style={styles.listValue}>
        {item.label}
      </Text>
      <Text type="small" textType={item.isTitle ? 'semiBold' : 'regular'} style={styles.listValue}>
        {item.value}
      </Text>
    </View>
  );

  const renderTotalView = (): React.ReactElement => {
    return (
      <View style={styles.totalView}>
        <Divider containerStyles={styles.divider} />
        <View style={styles.totalContent}>
          <Text type="small" textType="semiBold" style={styles.totalText}>
            Total
          </Text>
          <Text type="small" textType="semiBold" style={styles.totalText}>
            {summary?.totalBasePriceFormatted}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.topSummaryContainer}>
      <FlatList data={summary.userInvoiceItemsFormatted} keyExtractor={keyExtractor} renderItem={renderItem} />
      {renderTotalView()}
    </View>
  );
};

export default InvoiceSummary;

const styles = StyleSheet.create({
  listValue: {
    color: theme.colors.darkTint3,
  },
  totalText: {
    color: theme.colors.darkTint2,
  },
  totalView: {
    marginBottom: 16,
  },
  totalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  divider: {
    borderWidth: 1,
    borderColor: theme.colors.darkTint7,
  },
  itemsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  topSummaryContainer: {
    marginBottom: 10,
  },
});
