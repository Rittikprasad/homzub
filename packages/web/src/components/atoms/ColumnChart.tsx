import React from 'react';
import { ScrollView } from 'react-native';
import ReactApexCharts from 'react-apexcharts';
import { WithTranslation, withTranslation } from 'react-i18next';
import _ from 'lodash';
import { IGraphProps } from '@homzhub/common/src/utils/FinanceUtil';
import { theme } from '@homzhub/common/src/styles/theme';
import { BarGraphLegends } from '@homzhub/common/src/domain/models/GeneralLedgers';

interface IOwnProps {
  data: IGraphProps;
  currencySymbol: string;
}

interface ISeries {
  data: number[];
  name: string;
}

interface IOwnState {
  seriesData: ISeries[];
}

type IProps = WithTranslation & IOwnProps;

class ColumnChart extends React.PureComponent<IProps, IOwnState> {
  public state = {
    seriesData: [],
  };

  public componentDidMount(): void {
    this.updateData();
  }

  public componentDidUpdate(prevProps: Readonly<IProps>): boolean {
    const { data, currencySymbol } = this.props;
    const hasPropsChanged = !_.isEqual(prevProps.data, data) || !_.isEqual(prevProps.currencySymbol, currencySymbol);
    if (hasPropsChanged) {
      this.updateData();
    }
    return hasPropsChanged;
  }

  public render(): React.ReactNode {
    const { data, currencySymbol } = this.props;
    const { data1: debit, data2: credit, label, type } = data;
    const { options } = this.initConfig(currencySymbol, label, type, _.sum(debit), _.sum(credit));
    const { seriesData } = this.state;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ReactApexCharts options={options} series={seriesData} type="bar" height={250} width={550} />
      </ScrollView>
    );
  }

  public initConfig = (
    currencySymbol: string,
    label: string[],
    type: string,
    totalDebit: number,
    totalCredit: number
  ): Record<string, any> => ({
    // Initial Config of Graph
    options: {
      chart: {
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      colors: [theme.colors.income, theme.colors.expense],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '40%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: label,
      },
      yaxis: {
        labels: {
          formatter(value: number): string {
            return `${currencySymbol} ${value > 1000 ? value / 1000 : value}${value > 1000 ? 'k' : ''}`;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        formatter(seriesName: string): string[] {
          return [seriesName, ' - ', `${currencySymbol} ${seriesName === 'Expense' ? totalDebit : totalCredit}`];
        },
      },
      tooltip: {
        y: {
          formatter(val: number): string {
            return `${currencySymbol} ${val}`;
          },
        },
      },
    },
  });

  public seriesData = (debit: number[], credit: number[]): { data: number[]; name: string }[] => {
    return [
      {
        name: BarGraphLegends.income,
        data: credit,
      },
      {
        name: BarGraphLegends.expense,
        data: debit,
      },
    ];
  };

  private updateData = (): void => {
    const { data } = this.props;
    const { data1: debit, data2: credit } = data;
    const seriesData: ISeries[] = [];
    this.seriesData(debit, credit).forEach((item): void => {
      seriesData.push(item);
    });
    this.setState({
      seriesData,
    });
  };
}

export default withTranslation()(ColumnChart);
