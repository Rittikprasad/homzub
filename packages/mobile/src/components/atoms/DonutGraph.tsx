import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { isEqual } from 'lodash';
import { FinanceUtils } from '@homzhub/common/src/utils/FinanceUtil';
import { ObjectUtils } from '@homzhub/common/src/utils/ObjectUtils';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { GraphLegends } from '@homzhub/mobile/src/components/atoms/GraphLegends';
import { GeneralLedgers, IGeneralLedgerGraphData } from '@homzhub/common/src/domain/models/GeneralLedgers';

const INNER_RADIUS = '50%';
const HEIGHT = 225;
interface IProps {
  data: GeneralLedgers[];
}

const DonutGraph = (props: IProps): React.ReactElement => {
  const { data } = props;
  const [donutData, setDonutData] = useState<IGeneralLedgerGraphData[]>([]);

  useEffect(() => {
    const ledgersByCategory = ObjectUtils.groupBy<GeneralLedgers>(data, 'categoryId');
    const transformedData: IGeneralLedgerGraphData[] = [];

    Object.keys(ledgersByCategory).forEach((categoryId) => {
      const ledgers = ledgersByCategory[categoryId];
      const { category } = ledgers[0];
      let { amount } = ledgers[0];

      if (ledgers.length > 1) {
        amount = ledgersByCategory[categoryId].reduce((acc, ledger) => acc + ledger.amount, 0);
      }

      transformedData.push({
        key: Number(categoryId),
        title: category,
        value: amount,
        svg: { fill: FinanceUtils.getGraphColor(category) },
      });
    });

    setDonutData(transformedData);
  }, [data]);

  const render = (): React.ReactElement => {
    if (data.length === 0) return <EmptyState />;

    return (
      <>
        <PieChart style={styles.pieChart} padAngle={0.025} data={donutData} innerRadius={INNER_RADIUS} />
        <GraphLegends data={donutData} />
      </>
    );
  };
  return render();
};

const styles = StyleSheet.create({
  pieChart: {
    flex: 1,
    marginBottom: 16,
    height: HEIGHT,
  },
});

const memoizedComponent = React.memo(DonutGraph, isEqual);
export { memoizedComponent as DonutGraph };
