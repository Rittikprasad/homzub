import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { GooglePlaceDetail } from '@homzhub/common/src/services/GooglePlaces/interfaces';

export type NavigationScreenProps<S extends Record<string, object | undefined>, T extends keyof S> = {
  navigation: StackNavigationProp<S, T>;
  route: RouteProp<S, T>;
};

export type NestedNavigatorParams<ParamList> = {
  [K in keyof ParamList]: undefined extends ParamList[K]
    ? { screen: K; params?: ParamList[K] }
    : { screen: K; params: ParamList[K] };
}[keyof ParamList];

export enum ScreenKeys {
  // Common
  OnBoarding = 'OnBoarding',
  ComingSoon = 'ComingSoon',
  WebViewScreen = 'WebViewScreen',

  // Auth
  AuthStack = 'AuthStack',
  AppStack = 'AppStack',
  Login = 'LoginScreen',
  EmailLogin = 'EmailLoginScreen',
  Signup = 'SignupScreen',
  WorkLocations = 'AddWorkLocations',
  MobileVerification = 'MobileVerification',

  // BottomTabs
  BottomTab = 'BottomTab',
  Dashboard = 'Dashboard',
  SiteVisits = 'SiteVisits',
  Requests = 'Requests',
  Supplies = 'Supplies',
  More = 'More',

  // Dashboard
  DashboardScreen = 'DashboardScreen',
  HotProperties = 'HotProperties',

  // Visit
  SiteVisitDashboard = 'SiteVisitDashboard',
  VisitForm = 'VisitForm',
  VisitDetail = 'VisitDetail',
  FeedbackForm = 'FeedbackForm',
  Inspection = 'Inspection',

  // Reports
  ReportDashboard = 'ReportDashboard',
  InspectionSelection = 'InspectionSelection',
  ReportLocationMap = 'ReportLocationMap',

  // Requests
  RequestsDashboard = 'RequestsDashboard',
  RequestDetail = 'RequestDetail',
  SubmitQuote = 'SubmitQuote',
  WorkInitiated = 'WorkInitiated',
  SendUpdate = 'SendUpdate',
  WorkCompleted = 'WorkCompleted',

  // More
  MoreScreen = 'MoreScreen',
  Reports = 'Reports',
  UserProfile = 'UserProfile',
  UpdateUserProfile = 'UpdateUserProfile',
  UpdatePassword = 'UpdatePassword',
}

export interface IVisitParam {
  startDate: string;
  comment: string;
}

export interface IFeedbackParam {
  visitId: number;
  isSubmitted: boolean;
  feedbackId: number | null;
}

export interface IVisitDetailParam {
  visitId: number;
}

export interface ILocationParam {
  placeData: GooglePlaceDetail;
}

export interface IInspectionParam {
  isCompleted: boolean;
}

export interface IWebviewProps {
  url: string;
}
