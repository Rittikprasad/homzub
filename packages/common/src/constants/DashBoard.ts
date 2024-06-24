import { icons } from '@homzhub/common/src/assets/icon';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';

export interface IPropertyNotificationDetails {
  label: string;
  count: number;
  icon: string;
  colorCode?: string;
  iconColor?: string;
  imageBackgroundColor?: string;
}

export interface IPropertyNotification {
  icon: string;
  iconColor: string;
  title: string;
  count: number;
  details: IPropertyNotificationDetails[];
  url: string;
}

export enum sideMenuItems {
  dashboard = 'landing:home',
  financials = 'assetFinancial:financial',
  portfolio = 'common:properties',
  notifications = 'notifications',
  tickets = 'tickets',
  kycDocuments = 'kycDocuments',
  savedProperties = 'savedProperties',
  propertyVisits = 'propertyVisits',
  offers = 'common:offers',
  newLaunches = 'newLaunches',
  marketTrends = 'marketTrends',
  valueAddedServices = 'marketPlace',
  settings = 'settings',
  manageSubscription = 'common:manageSubscription',
  paymentMethods = 'paymentMethods',
  bankDetails = 'bankDetails',
  referAndEarn = 'referFriend',
  logout = 'logout',
}
export interface IMenuItemList {
  id: number;
  name: string;
  icon: string;
  url: string;
}

export const MenuItemList: IMenuItemList[] = [
  {
    id: 1,
    name: sideMenuItems.dashboard,
    icon: icons.dashboard,
    url: RouteNames.protectedRoutes.DASHBOARD,
  },
  {
    id: 2,
    name: sideMenuItems.financials,
    icon: icons.barChartOutline,
    url: RouteNames.protectedRoutes.FINANCIALS,
  },
  {
    id: 3,
    name: sideMenuItems.portfolio,
    icon: icons.portfolio,
    url: RouteNames.protectedRoutes.PORTFOLIO,
  },
  {
    id: 4,
    name: sideMenuItems.tickets,
    icon: icons.serviceRequest,
    url: RouteNames.protectedRoutes.SERVICE_TICKETS,
  },
  {
    id: 5,
    name: sideMenuItems.savedProperties,
    icon: icons.heartOutline,
    url: RouteNames.protectedRoutes.SAVED_PROPERTIES,
  },
  {
    id: 6,
    name: sideMenuItems.propertyVisits,
    icon: icons.visit,
    url: RouteNames.protectedRoutes.PROPERTY_VISITS,
  },
  {
    id: 7,
    name: sideMenuItems.offers,
    icon: icons.offers,
    url: RouteNames.protectedRoutes.OFFERS,
  },
  {
    id: 8,
    name: sideMenuItems.notifications,
    icon: icons.bell,
    url: RouteNames.protectedRoutes.NOTIFICATIONS,
  },
  {
    id: 9,
    name: sideMenuItems.valueAddedServices,
    icon: icons.settingOutline,
    url: RouteNames.protectedRoutes.VALUE_ADDED_SERVICES,
  },
  {
    id: 10,
    name: sideMenuItems.bankDetails,
    icon: icons.bankBuilding,
    url: RouteNames.protectedRoutes.REFER_EARN,
  },
  {
    id: 11,
    name: sideMenuItems.referAndEarn,
    icon: icons.refer,
    url: RouteNames.protectedRoutes.REFER_EARN,
  },

  {
    id: 12,
    name: sideMenuItems.logout,
    icon: icons.logOut,
    url: RouteNames.protectedRoutes.LOGOUT,
  },
];
