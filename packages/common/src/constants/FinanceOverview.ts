import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { DataGroupBy } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

export enum DateFilter {
  thisMonth = 1,
  lastMonth = 2,
  thisYear = 3,
  thisFinancialYear = 4,
  lastYear = 5,
  thisWeek = 6,
  lastWeek = 7,
}

export interface IDropdownObject {
  label: string;
  value: DateFilter;
  startDate: string;
  endDate: string;
  dataGroupBy: DataGroupBy;
  displayValueAfterSelection?: string;
}

export enum DateRangeType {
  Month = 'month',
  Year = 'year',
}

export enum ExpenseCategory {
  FURNISHING_RENOVATION = 'Furnishing and Renovation',
  TAXES = 'Taxes',
  REPAIR = 'Repair',
  INSURANCE = 'Insurance',
  LOAN_PAYMENT = 'Loan Payment',
  SOCIETY_CHARGES = 'Society Charges',
  OTHERS = 'Others',
  PAYMENT = 'Payments',
}

const translationKey = LocaleConstants.namespacesKey.common;

export const FINANCIAL_DROPDOWN_DATA = {
  [DateFilter.thisMonth]: {
    label: `${translationKey}:monthToDate`,
    value: DateFilter.thisMonth,
    startDate: DateUtils.getCurrentMonthStartDate(),
    endDate: DateUtils.getCurrentMonthLastDate(),
    dataGroupBy: DataGroupBy.week,
    displayValueAfterSelection: `${translationKey}:mtd`,
  },
  [DateFilter.lastMonth]: {
    label: `${translationKey}:lastMonth`,
    value: DateFilter.lastMonth,
    startDate: DateUtils.getPreviousMonthStartDate(),
    endDate: DateUtils.getPreviousMonthLastDate(),
    dataGroupBy: DataGroupBy.week,
  },
  [DateFilter.thisYear]: {
    label: `${translationKey}:yearToDate`,
    value: DateFilter.thisYear,
    startDate: DateUtils.getCurrentYearStartDate(),
    endDate: DateUtils.getCurrentDate(),
    dataGroupBy: DataGroupBy.month,
    displayValueAfterSelection: `${translationKey}:ytd`,
  },
  [DateFilter.thisFinancialYear]: {
    label: `${translationKey}:thisFinancialYear`,
    value: DateFilter.thisFinancialYear,
    startDate: '',
    endDate: '',
    dataGroupBy: DataGroupBy.month,
    displayValueAfterSelection: `${translationKey}:cfy`,
  },
  [DateFilter.lastYear]: {
    label: `${translationKey}:lastYear`,
    value: DateFilter.lastYear,
    startDate: DateUtils.getPreviousYearStartDate(),
    endDate: DateUtils.getPreviousYearLastDate(),
    dataGroupBy: DataGroupBy.month,
  },
};
