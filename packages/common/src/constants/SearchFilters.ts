import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const translationKey = LocaleConstants.namespacesKey.common;

export interface IFilterDataObject {
  title: string;
  value: number;
}

export const BEDROOM_FILTER = [
  {
    title: `${translationKey}:any`,
    value: -1,
  },
  {
    title: `${translationKey}:one`,
    value: 1,
  },
  {
    title: `${translationKey}:two`,
    value: 2,
  },
  {
    title: `${translationKey}:three`,
    value: 3,
  },
  {
    title: `${translationKey}:four`,
    value: 4,
  },
  {
    title: `${translationKey}:fivePlus`,
    value: 5,
  },
];

export const BATHROOM_FILTER = [
  {
    title: `${translationKey}:any`,
    value: -1,
  },
  {
    title: `${translationKey}:onePlus`,
    value: 1,
  },
  {
    title: `${translationKey}:twoPlus`,
    value: 2,
  },
  {
    title: `${translationKey}:threePlus`,
    value: 3,
  },
  {
    title: `${translationKey}:fourPlus`,
    value: 4,
  },
  {
    title: `${translationKey}:fivePlus`,
    value: 5,
  },
];
