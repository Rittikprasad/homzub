import { TFunction } from 'i18next';
import { sum } from 'lodash';
import { DateUtils, MonthNames } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { ObjectUtils } from '@homzhub/common/src/utils/ObjectUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import {
  BarGraphLegends,
  GeneralLedgers,
  IGeneralLedgerGraphData,
  LedgerTypes,
} from '@homzhub/common/src/domain/models/GeneralLedgers';
import {
  DateFilter,
  DateRangeType,
  ExpenseCategory,
  FINANCIAL_DROPDOWN_DATA,
  IDropdownObject,
} from '@homzhub/common/src/constants/FinanceOverview';

export interface IGraphProps {
  data1: number[];
  data2: number[];
  label: string[];
  type: DateRangeType;
}

export interface IFinancialYear {
  startDate: string;
  endDate: string;
  startMonthIndex: number;
  endMonthIndex: number;
}

export interface IGeneralLedgersParams {
  selectedTimeRange: DateFilter;
  financialYear: IFinancialYear;
  selectedCountry?: number | undefined;
  selectedProperty?: number | undefined;
}

class FinanceUtils {
  public getGeneralLedgers = async (
    params: IGeneralLedgersParams,
    success: (data: GeneralLedgers[]) => void,
    failure: (errorMsg: string) => void
  ): Promise<void> => {
    const { selectedTimeRange, financialYear, selectedCountry, selectedProperty } = params;
    const { endDate: finEndDate, startDate: finStartDate } = financialYear;
    // @ts-ignore
    let { endDate, startDate } = FINANCIAL_DROPDOWN_DATA[selectedTimeRange];
    // @ts-ignore
    const { value, dataGroupBy } = FINANCIAL_DROPDOWN_DATA[selectedTimeRange];

    if (value === DateFilter.thisFinancialYear) {
      endDate = finEndDate;
      startDate = finStartDate;
    }

    try {
      const response: GeneralLedgers[] = await LedgerRepository.getLedgerPerformances({
        transaction_date__gte: startDate,
        transaction_date__lte: endDate,
        transaction_date_group_by: dataGroupBy,
        asset_id: selectedProperty || undefined,
        country_id: selectedCountry || undefined,
      });
      success(response);
    }catch (err: any) {      failure(ErrorUtils.getErrorMessage(err.details));
    }
  };

  public renderCalenderLabel = (params: IGeneralLedgersParams): string => {
    const { selectedTimeRange, financialYear } = params;
    switch (selectedTimeRange) {
      case DateFilter.thisYear:
        return DateUtils.getCurrentYear();
      case DateFilter.lastMonth:
        return DateUtils.getLastMonth();
      case DateFilter.lastYear:
        return DateUtils.getLastYear();
      case DateFilter.thisFinancialYear: {
        const { startDate, endDate, startMonthIndex, endMonthIndex } = financialYear;

        const startMonth = MonthNames[startMonthIndex];
        const startYear = startDate.split('-')[0];
        const endMonth = MonthNames[endMonthIndex];
        const endYear = endDate.split('-')[0];

        return `${startMonth} ${parseInt(startYear, 10) % 100} - ${endMonth} ${parseInt(endYear, 10) % 100}`;
      }
      default:
        return DateUtils.getCurrentMonth();
    }
  };

  public renderFilterOptions = (t: TFunction): IDropdownObject[] => {
    const data = Object.values(FINANCIAL_DROPDOWN_DATA);

    return data.map((currentData: IDropdownObject) => {
      return {
        ...currentData,
        label: t(currentData.label),
        ...(currentData?.displayValueAfterSelection && {
          displayValueAfterSelection: t(currentData.displayValueAfterSelection),
        }),
      };
    });
  };

  public barGraphLegends = (debit: number[], credit: number[]): IGeneralLedgerGraphData[] => {
    return [
      {
        key: 1,
        title: BarGraphLegends.income,
        value: sum(credit),
        svg: { fill: theme.colors.income },
      },
      {
        key: 2,
        title: BarGraphLegends.expense,
        value: sum(debit),
        svg: { fill: theme.colors.expense },
      },
    ];
  };

  public getBarGraphData = (params: IGeneralLedgersParams, ledgersData: GeneralLedgers[]): IGraphProps => {
    const { selectedTimeRange, financialYear } = params;
    switch (selectedTimeRange) {
      case DateFilter.thisYear:
      case DateFilter.thisFinancialYear:
      case DateFilter.lastYear:
        return this.getGraphDataForYear({ selectedTimeRange, financialYear }, ledgersData);
      default:
        return this.getGraphDataForMonth(selectedTimeRange, ledgersData);
    }
  };

  private getGraphDataForYear = (params: IGeneralLedgersParams, ledgersData: GeneralLedgers[]): IGraphProps => {
    const { selectedTimeRange, financialYear } = params;
    const { startMonthIndex, endMonthIndex } = financialYear;

    let monthList = MonthNames;
    if (selectedTimeRange === DateFilter.thisFinancialYear) {
      monthList = DateUtils.getMonthRange(startMonthIndex, endMonthIndex);
    }

    let debitArray = new Array(12).fill(0);
    let creditArray = new Array(12).fill(0);

    const dataByMonth = ObjectUtils.groupBy<GeneralLedgers>(ledgersData, 'transactionDateLabel');
    Object.keys(dataByMonth).forEach((key: string) => {
      const currentMonthData = dataByMonth[key];
      const debitsSum = LedgerUtils.totalByType(LedgerTypes.debit, currentMonthData);
      const creditsSum = LedgerUtils.totalByType(LedgerTypes.credit, currentMonthData);
      const currentMonth = MonthNames[parseInt(key.split('-')[1], 10) - 1];
      const currentMonthIndex = monthList.findIndex((month) => month === currentMonth);
      debitArray[currentMonthIndex] = debitsSum;
      creditArray[currentMonthIndex] = creditsSum;
    });

    if (selectedTimeRange === DateFilter.thisFinancialYear || selectedTimeRange === DateFilter.thisYear) {
      // Remove every entry in the future
      const currentMonthIndex = monthList.findIndex((month) => month === DateUtils.getCurrentMonthName());
      debitArray = debitArray.slice(0, currentMonthIndex + 1);
      creditArray = creditArray.slice(0, currentMonthIndex + 1);
      monthList = monthList.slice(0, currentMonthIndex + 1);
    }

    return {
      data1: debitArray,
      data2: creditArray,
      label: monthList,
      type: DateRangeType.Year,
    };
  };

  private getGraphDataForMonth = (selectedTimeRange: DateFilter, ledgersData: GeneralLedgers[]): IGraphProps => {
    const currentYear = Number(DateUtils.getCurrentYear());
    const requiredMonth =
      selectedTimeRange === DateFilter.thisMonth
        ? DateUtils.getCurrentMonthIndex()
        : DateUtils.getCurrentMonthIndex() - 1;

    const startingWeekNumber =
      requiredMonth === 0 ? 1 : DateUtils.getISOWeekNumber(new Date(currentYear, requiredMonth, 1));
    const lastWeekNumber = DateUtils.getISOWeekNumber(new Date(currentYear, requiredMonth + 1, 0));
    let weekCount = lastWeekNumber - startingWeekNumber;

    if (weekCount < 0) {
      weekCount = 0;
    }
    const weekList = new Array(weekCount).fill('');
    const weekListNumber = new Array(weekCount).fill(0);
    for (let i = 0; i < weekCount; i++) {
      weekList[i] = `Week ${i + 1}`;
      weekListNumber[i] = Number(startingWeekNumber) + i;
    }

    const debitArray = new Array(weekCount).fill(0);
    const creditArray = new Array(weekCount).fill(0);
    const dataByWeek = ObjectUtils.groupBy<GeneralLedgers>(ledgersData, 'transactionDateLabel');

    Object.keys(dataByWeek).forEach((key: string) => {
      const currentWeekData = dataByWeek[key];

      const debitsSum = LedgerUtils.totalByType(LedgerTypes.debit, currentWeekData);
      const creditsSum = LedgerUtils.totalByType(LedgerTypes.credit, currentWeekData);

      const currentWeek = Number(key.split('-')[1]);
      const currentMonthIndex = weekListNumber.findIndex((week) => week === currentWeek);

      debitArray[currentMonthIndex] = debitsSum;
      creditArray[currentMonthIndex] = creditsSum;
    });
    return {
      data1: debitArray,
      data2: creditArray,
      label: weekList,
      type: DateRangeType.Month,
    };
  };

  public getGraphColor = (category: string): string => {
    const { FURNISHING_RENOVATION, PAYMENT, LOAN_PAYMENT, SOCIETY_CHARGES, TAXES, INSURANCE, REPAIR, OTHERS } =
      ExpenseCategory;
    const { purple, greenTint5, yellowTint1, redTint2, redTint3, rental, disabledSearch, other } = theme.colors;

    switch (category) {
      case FURNISHING_RENOVATION:
        return purple;
      case TAXES:
        return yellowTint1;
      case REPAIR:
        return redTint2;
      case INSURANCE:
        return rental;
      case LOAN_PAYMENT:
        return redTint3;
      case SOCIETY_CHARGES:
        return disabledSearch;
      case PAYMENT:
        return greenTint5;
      case OTHERS:
      default:
        return other;
    }
  };
}

const financeUtils = new FinanceUtils();
export { financeUtils as FinanceUtils };
