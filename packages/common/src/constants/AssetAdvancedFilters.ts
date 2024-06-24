import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

export interface IFilterData {
  value: number;
  label: string;
}

export interface IAdvancedFilters {
  searchRadius: IFilterData[];
  dateAdded: IFilterData[];
  propertyAge: IFilterData[];
  rentFreePeriod: IFilterData[];
}

const translationKey = LocaleConstants.namespacesKey.propertySearch;

export const AdvancedFilters = {
  searchRadius: [
    {
      value: 50,
      label: `${translationKey}:thisAreaOnly`,
    },
    {
      value: 0.25,
      label: `${translationKey}:withinQuarter`,
    },
    {
      value: 0.5,
      label: `${translationKey}:withinHalf`,
    },
    {
      value: 1,
      label: `${translationKey}:within1`,
    },
    {
      value: 5,
      label: `${translationKey}:within5`,
    },
    {
      value: 10,
      label: `${translationKey}:within10`,
    },
    {
      value: 20,
      label: `${translationKey}:within20`,
    },
    {
      value: 30,
      label: `${translationKey}:within30`,
    },
    {
      value: 40,
      label: `${translationKey}:within40`,
    },
  ],
  dateAdded: [
    {
      value: 1,
      label: `${translationKey}:anytime`,
    },
    {
      value: 2,
      label: `${translationKey}:last24hours`,
    },
    {
      value: 3,
      label: `${translationKey}:last3days`,
    },
    {
      value: 4,
      label: `${translationKey}:last7days`,
    },
    {
      value: 5,
      label: `${translationKey}:last14days`,
    },
    {
      value: 6,
      label: `${translationKey}:last28days`,
    },
  ],
  propertyAge: [
    {
      value: 1,
      label: `${translationKey}:lessThan1Year`,
    },
    {
      value: 2,
      label: `${translationKey}:lessThan5Year`,
    },
    {
      value: 3,
      label: `${translationKey}:lessThan10Year`,
    },
    {
      value: 4,
      label: `${translationKey}:lessThan15Year`,
    },
    {
      value: 5,
      label: `${translationKey}:lessThan20Year`,
    },
    {
      value: 6,
      label: `${translationKey}:moreThan20Year`,
    },
  ],
  rentFreePeriod: [
    {
      value: 1,
      label: `${translationKey}:least15days`,
    },
    {
      value: 2,
      label: `${translationKey}:least30days`,
    },
    {
      value: 3,
      label: `${translationKey}:least45days`,
    },
    {
      value: 4,
      label: `${translationKey}:least60days`,
    },
    {
      value: -1,
      label: `${translationKey}:anyPeriod`,
    },
  ],
};
