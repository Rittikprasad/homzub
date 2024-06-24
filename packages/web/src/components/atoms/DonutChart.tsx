import React from 'react';
import ReactApexCharts from 'react-apexcharts';
import _ from 'lodash';
import { FinanceUtils } from '@homzhub/common/src/utils/FinanceUtil';
import { ObjectUtils } from '@homzhub/common/src/utils/ObjectUtils';
import { GeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';

interface IProps {
  data: GeneralLedgers[];
  currencySymbol: string;
}

interface IState {
  series: number[];
  labels: string[];
  colors: string[];
}

class DonutChart extends React.PureComponent<IProps, IState> {
  public state = {
    series: [],
    labels: [],
    colors: [],
  };

  public componentDidMount(): void {
    this.modelData();
  }

  public componentDidUpdate(prevProps: Readonly<IProps>): boolean {
    const { data, currencySymbol } = this.props;
    const hasPropsChanged = !_.isEqual(prevProps.data, data) || !_.isEqual(prevProps.currencySymbol, currencySymbol);
    if (hasPropsChanged) {
      this.modelData();
    }
    return hasPropsChanged;
  }

  public render(): React.ReactNode {
    const { labels, colors, series } = this.state;
    const { currencySymbol } = this.props;
    const { options } = this.initConfig(currencySymbol, labels, colors);
    return <ReactApexCharts options={options} series={series} type="donut" height={280} />;
  }

  public modelData = (): void => {
    const { data } = this.props;
    const ledgersByCategory = ObjectUtils.groupBy<GeneralLedgers>(data, 'categoryId');
    const series: number[] = [];
    const colors: string[] = [];
    const labels: string[] = [];
    Object.keys(ledgersByCategory).forEach((categoryId) => {
      const ledgers = ledgersByCategory[categoryId];
      const { category } = ledgers[0];
      let { amount } = ledgers[0];

      if (ledgers.length > 1) {
        amount = ledgersByCategory[categoryId].reduce((acc: number, ledger: GeneralLedgers) => acc + ledger.amount, 0);
      }
      series.push(amount);
      labels.push(category);
      colors.push(FinanceUtils.getGraphColor(category));
    });
    this.setState({ series, colors, labels });
  };

  private initConfig = (currencySymbol: string, dataLabels: string[], colors: string[]): any => ({
    // Initial Config of Graph
    options: {
      chart: {
        type: 'donut',
      },
      labels: dataLabels,
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        formatter(
          seriesName: string,
          opts: { w: { globals: { series: number[] } }; seriesIndex: string | number }
        ): string[] {
          return [seriesName, ' - ', `${currencySymbol} ${opts.w.globals.series[opts.seriesIndex as number]}`];
        },
      },
      colors,
    },
  });
}

export default DonutChart;
