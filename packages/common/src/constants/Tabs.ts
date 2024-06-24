import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';

// enum START

export enum Tabs {
  NOTIFICATIONS = 'Notifications',
  TICKETS = 'Tickets',
  OFFERS = 'Offers',
  REVIEWS = 'Reviews',
  SITE_VISITS = 'Property Visits',
  FINANCIALS = 'Financials',
  MESSAGES = 'Messages',
  DOCUMENTS = 'Documents',
  TENANT_HISTORY = 'Tenant History',
  DETAILS = 'Details',
  HIGHLIGHTS = 'Highlights',
  GALLERY = 'Gallery',
  UPCOMING = 'Upcoming',
  MISSED = 'Missed',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  DECLINED = 'Declined',
  ACTIONS = 'Actions',
  VERIFICATIONS = 'Verification',
  SERVICES = 'Services',
  PAYMENT = 'Payment',
  SERVICE_PAYMENT = 'Service & Payment',
  DESCRIPTION = 'Description / Features',
  AMENITIES = 'Amenities & Highlights',
  NEIGHBOURHOOD = 'Neighbourhood',
  REVIEWS_RATING = 'Reviews & Ratings',
  VIDEO = 'Video Tour',
  ALL = 'All',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  ALERT = 'Alert',
  REQUESTS = 'Requests',
  CHAT = 'Chat',
  RENT_PAYMENT = 'Rent Payment',
  SOCIETY_BILL = 'Society Bill',
  TAX_PAYMENT = 'Tax Payment',
  GAS_PIPELINE_SERVICE = 'Gas and Pipeline Service',
  WATER_SERVICE = 'Water Service',
  ELECTRICITY_MANAGEMENT = 'Electricity management',
  NEW = 'New',
  ONGOING = 'Ongoing',
  RENT = 'Rent',
  SELL = 'Sell',
}

// enum END

export interface IRoutes {
  key: Tabs;
  title: string;
  color?: string;
  icon?: string;
  count?: number;
}

// Property Detail Screen Tabs START

export const tabName = [
  Tabs.NOTIFICATIONS,
  Tabs.TICKETS,
  Tabs.OFFERS,
  Tabs.REVIEWS,
  Tabs.SITE_VISITS,
  Tabs.FINANCIALS,
  Tabs.MESSAGES,
  Tabs.DOCUMENTS,
  Tabs.TENANT_HISTORY,
  Tabs.DETAILS,
];

export const TenantRoutes: IRoutes[] = [
  { key: Tabs.ALERT, title: Tabs.ALERT, icon: icons.alert, color: theme.colors.redTint4 },
  { key: Tabs.REQUESTS, title: Tabs.REQUESTS, icon: icons.serviceRequest, color: theme.colors.redTint5 },
  { key: Tabs.CHAT, title: Tabs.CHAT, icon: icons.chat, color: theme.colors.lightGreen },
  { key: Tabs.DOCUMENTS, title: Tabs.DOCUMENTS, icon: icons.documents, color: theme.colors.gray16 },
  { key: Tabs.DETAILS, title: Tabs.DETAILS, icon: icons.detail, color: theme.colors.blueTint1 },
];

export const Routes: IRoutes[] = [
  { key: Tabs.ALERT, title: Tabs.ALERT, icon: icons.alert, color: theme.colors.redTint4 },
  { key: Tabs.REQUESTS, title: Tabs.REQUESTS, icon: icons.serviceRequest, color: theme.colors.redTint5 },
  { key: Tabs.CHAT, title: Tabs.CHAT, icon: icons.chat, color: theme.colors.lightGreen },
  { key: Tabs.REVIEWS, title: Tabs.REVIEWS, icon: icons.reviews, color: theme.colors.yellowTint3 },
  { key: Tabs.FINANCIALS, title: Tabs.FINANCIALS, icon: icons.financials, color: theme.colors.greenTint4 },
  { key: Tabs.DOCUMENTS, title: Tabs.DOCUMENTS, icon: icons.documents, color: theme.colors.gray16 },
  { key: Tabs.TENANT_HISTORY, title: Tabs.TENANT_HISTORY, icon: icons.history, color: theme.colors.blueTint2 },
  { key: Tabs.DETAILS, title: Tabs.DETAILS, icon: icons.detail, color: theme.colors.blueTint1 },
];

// (WEB)
export const PropertyDetailOwner: IRoutes[] = [
  { key: Tabs.DETAILS, title: Tabs.DETAILS, icon: icons.detail },
  { key: Tabs.NOTIFICATIONS, title: Tabs.NOTIFICATIONS, icon: icons.alert },
  { key: Tabs.MESSAGES, title: Tabs.MESSAGES, icon: icons.mail },
  { key: Tabs.TICKETS, title: Tabs.TICKETS, icon: icons.headset },
  { key: Tabs.SERVICES, title: Tabs.SERVICES, icon: icons.service },
  { key: Tabs.FINANCIALS, title: Tabs.FINANCIALS, icon: icons.financials },
  { key: Tabs.DOCUMENTS, title: Tabs.DOCUMENTS, icon: icons.documents },
  { key: Tabs.TENANT_HISTORY, title: Tabs.TENANT_HISTORY, icon: icons.history },
  { key: Tabs.SITE_VISITS, title: Tabs.SITE_VISITS, icon: icons.visit },
  { key: Tabs.OFFERS, title: Tabs.OFFERS, icon: icons.offers },
  { key: Tabs.REVIEWS, title: Tabs.REVIEWS, icon: icons.reviews },
];

export const PropertyDetailRoutes = [
  { key: Tabs.DESCRIPTION, title: Tabs.DESCRIPTION, icon: icons.detail },
  { key: Tabs.AMENITIES, title: Tabs.AMENITIES, icon: icons.swimmingPool },
  { key: Tabs.NEIGHBOURHOOD, title: Tabs.NEIGHBOURHOOD, icon: icons.neighborhood },
  { key: Tabs.REVIEWS_RATING, title: Tabs.REVIEWS_RATING, icon: icons.reviews },
];

// Property Detail Screen Tabs END

// Add Property Tabs START

export const AddPropertyRoutes: IRoutes[] = [
  { key: Tabs.DETAILS, title: Tabs.DETAILS },
  { key: Tabs.HIGHLIGHTS, title: Tabs.HIGHLIGHTS },
  { key: Tabs.GALLERY, title: Tabs.GALLERY },
];
export const AddPropertySteps = [Tabs.DETAILS, Tabs.HIGHLIGHTS, Tabs.GALLERY];

// Add Property Tabs END

// Site Visit Tabs START

export const VisitRoutes: IRoutes[] = [
  { key: Tabs.UPCOMING, title: Tabs.UPCOMING, color: theme.colors.mediumPriority },
  { key: Tabs.MISSED, title: Tabs.MISSED, color: theme.colors.error },
  { key: Tabs.COMPLETED, title: Tabs.COMPLETED, color: theme.colors.green },
];

// Site Visit Tabs END

// Listing Visit Tabs START

// (MOBILE)
export const ListingRoutes: IRoutes[] = [
  { key: Tabs.ACTIONS, title: Tabs.ACTIONS },
  { key: Tabs.VERIFICATIONS, title: Tabs.VERIFICATIONS },
  { key: Tabs.SERVICES, title: Tabs.SERVICES },
  { key: Tabs.PAYMENT, title: Tabs.PAYMENT },
];

// (WEB)
export const ListingRoutesWeb: IRoutes[] = [
  { key: Tabs.ACTIONS, title: Tabs.ACTIONS },
  { key: Tabs.VERIFICATIONS, title: Tabs.VERIFICATIONS },
  { key: Tabs.SERVICE_PAYMENT, title: Tabs.SERVICE_PAYMENT },
];

// Site Visit Tabs END

// Service Ticket Tabs START
export const TicketRoutes: IRoutes[] = [
  { key: Tabs.ALL, title: Tabs.ALL, color: theme.colors.blue },
  { key: Tabs.HIGH, title: Tabs.HIGH, color: theme.colors.error },
  { key: Tabs.MEDIUM, title: Tabs.MEDIUM, color: theme.colors.yellow },
  { key: Tabs.LOW, title: Tabs.LOW, color: theme.colors.blue },
];

// Service Ticket Tabs END

// Property Payment Tabs START
export const PropertyPaymentRoutes: IRoutes[] = [
  { key: Tabs.RENT_PAYMENT, title: Tabs.RENT_PAYMENT, icon: icons.rent, color: theme.colors.greenTint9 },
  { key: Tabs.SOCIETY_BILL, title: Tabs.SOCIETY_BILL, icon: icons.society, color: theme.colors.blueTint14 },
  { key: Tabs.TAX_PAYMENT, title: Tabs.TAX_PAYMENT, icon: icons.house, color: theme.colors.darkTint3 },
  { key: Tabs.GAS_PIPELINE_SERVICE, title: Tabs.GAS_PIPELINE_SERVICE, icon: icons.gas, color: theme.colors.expense },
  { key: Tabs.WATER_SERVICE, title: Tabs.WATER_SERVICE, icon: icons.water, color: theme.colors.greenTint3 },
  {
    key: Tabs.ELECTRICITY_MANAGEMENT,
    title: Tabs.ELECTRICITY_MANAGEMENT,
    icon: icons.bulb,
    color: theme.colors.redTint6,
  },
];
// Property Payment Tabs END

// FFM Site Visit Tabs START

export const FFMVisitRoutes: IRoutes[] = [
  { key: Tabs.NEW, title: Tabs.NEW, color: theme.colors.yellow },
  { key: Tabs.ONGOING, title: Tabs.ONGOING, color: theme.colors.mediumPriority },
  { key: Tabs.MISSED, title: Tabs.MISSED, color: theme.colors.error },
  { key: Tabs.COMPLETED, title: Tabs.COMPLETED, color: theme.colors.green },
];

// FFM Site Visit Tabs END

// FFM Hot Properties Tabs START

export const HotPropertiesRoutes: IRoutes[] = [
  { key: Tabs.RENT, title: Tabs.RENT },
  { key: Tabs.SELL, title: Tabs.SELL },
];

// FFM Hot Properties Tabs END
