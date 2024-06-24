import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

export interface IMoreScreenItem {
  id: number;
  title: string;
  icon: string;
  type: MoreScreenTypes;
  textColor: string;
  iconColor: string;
}

export interface IMoreScreens {
  [key: string]: IMoreScreenItem[];
}

export enum MoreScreenTypes {
  NOTIFICATIONS = 'notifications',
  TICKETS = 'tickets',
  KYC_DOCUMENTS = 'kycDocuments',
  MESSAGES = 'messages',
  SEARCH = 'search',
  SAVED_PROPERTIES = 'savedProperties',
  PROPERTY_VISITS = 'propertyVisits',
  NEW_LAUNCHES = 'newLaunches',
  MARKET_TRENDS = 'marketTrends',
  VALUE_ADDED_SERVICES = 'valueAddedServices',
  SETTINGS = 'settings',
  PAYMENT_METHODS = 'paymentMethods',
  REFER_FRIEND = 'referFriend',
  SUPPORT = 'support',
  OFFERS = 'Offers',
  FAQS = 'Faqs',
  BANK_DETAILS = 'bankDetails',
  SUPPLIES = 'supplies',
}

const ICON_COLOR = theme.colors.lowPriority;
const TEXT_COLOR = theme.colors.shadow;
const translationKey = LocaleConstants.namespacesKey.assetMore;

export const MORE_SCREENS: IMoreScreens = {
  sectionA: [
    {
      id: 1,
      title: `${translationKey}:notifications`,
      icon: icons.alert,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.NOTIFICATIONS,
    },
    {
      id: 2,
      title: `${translationKey}:tickets`,
      icon: icons.serviceRequest,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.TICKETS,
    },
    {
      id: 3,
      title: `${translationKey}:kycDocuments`,
      icon: icons.documents,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.KYC_DOCUMENTS,
    },
    {
      id: 4,
      title: `${translationKey}:messages`,
      icon: icons.chat,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.MESSAGES,
    },
    {
      id: 5,
      title: 'assetMore:bankDetails',
      icon: icons.bankBuilding,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.BANK_DETAILS,
    },
  ],
  sectionB: [
    {
      id: 6,
      title: 'common:search',
      icon: icons.search,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.SEARCH,
    },
    {
      id: 7,
      title: `${translationKey}:savedProperties`,
      icon: icons.heartOutline,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.SAVED_PROPERTIES,
    },
    {
      id: 8,
      title: `${translationKey}:propertyVisits`,
      icon: icons.visit,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.PROPERTY_VISITS,
    },
    {
      id: 9,
      title: 'common:offers',
      icon: icons.offers,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.OFFERS,
    },
    {
      id: 10,
      title: `${translationKey}:newLaunches`,
      icon: icons.newLaunch,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.NEW_LAUNCHES,
    },
    {
      id: 11,
      title: `${translationKey}:marketTrends`,
      icon: icons.increase,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.MARKET_TRENDS,
    },
  ],
  sectionC: [
    {
      id: 12,
      title: `${translationKey}:settings`,
      icon: icons.setting,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.SETTINGS,
    },
    {
      id: 13,
      title: `${translationKey}:paymentMethods`,
      icon: icons.payment,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.PAYMENT_METHODS,
    },
  ],
  sectionD: [
    {
      id: 14,
      title: `${translationKey}:referFriend`,
      icon: icons.refer,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.REFER_FRIEND,
    },
    {
      id: 15,
      title: `${translationKey}:support`,
      icon: icons.headset,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.SUPPORT,
    },
    {
      id: 16,
      title: `${translationKey}:faqs`,
      icon: icons.faq,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.FAQS,
    },
  ],
};

export const FFM_MORE_SCREEN = {
  sectionA: [
    {
      id: 1,
      title: 'common:supplies',
      icon: icons.home,
      iconColor: ICON_COLOR,
      textColor: TEXT_COLOR,
      type: MoreScreenTypes.SUPPLIES,
    },
  ],
};
