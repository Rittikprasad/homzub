import { icons } from '@homzhub/common/src/assets/icon';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

export enum User {
  OWNER = 'OWNER',
  AGENT = 'AGENT',
  MANAGER = 'MANAGER',
}

const translationKey = LocaleConstants.namespacesKey.property;

export const UserType = [
  { id: 1, name: `${translationKey}:propertyOwner`, icon: icons.owner, key: User.OWNER },
  { id: 2, name: `${translationKey}:propertyAgent`, icon: icons.agent, key: User.AGENT },
  { id: 3, name: `${translationKey}:propertyManager`, icon: icons.manager, key: User.MANAGER },
];
