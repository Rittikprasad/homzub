import { theme } from '@homzhub/common/src/styles/theme';

export enum MenuEnum {
  EDIT = 'Edit',
  DELETE = 'Delete',
}

export const menu = [
  {
    label: MenuEnum.EDIT,
    value: MenuEnum.EDIT,
    labelColor: theme.colors.darkTint2,
  },
  {
    label: MenuEnum.DELETE,
    value: MenuEnum.DELETE,
    labelColor: theme.colors.error,
    isExtraData: true,
    isExtraDataAllowed: true,
  },
];
