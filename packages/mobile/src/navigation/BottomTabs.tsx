// @ts-noCheck
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFocusedRouteNameFromRoute } from '@react-navigation/core';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { StackActions } from '@react-navigation/native';
import Focused from '@homzhub/common/src/assets/images/homzhubLogo.svg';
import Unfocused from '@homzhub/common/src/assets/images/homzhubLogoUnfocused.svg';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import DefaultLogin from '@homzhub/mobile/src/screens/Asset/DefaultLogin';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { MoreStack, MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/MoreStack';
import { DashboardNavigatorParamList, DashboardStack } from '@homzhub/mobile/src/navigation/DashboardStack';
import { FinancialsNavigatorParamList, FinancialsStack } from '@homzhub/mobile/src/navigation/FinancialStack';
import { PortfolioNavigatorParamList, PortfolioStack } from '@homzhub/mobile/src/navigation/PortfolioStack';
import { ServiceNavigatorParamList, ServiceStack } from '@homzhub/mobile/src/navigation/ServiceStack';
import { NestedNavigatorParams, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

export type BottomTabNavigatorParamList = {
  [ScreensKeys.Portfolio]: NestedNavigatorParams<PortfolioNavigatorParamList>;
  [ScreensKeys.Financials]: NestedNavigatorParams<FinancialsNavigatorParamList>;
  [ScreensKeys.Dashboard]: NestedNavigatorParams<DashboardNavigatorParamList>;
  [ScreensKeys.Service]: NestedNavigatorParams<ServiceNavigatorParamList>;
  [ScreensKeys.More]: NestedNavigatorParams<MoreStackNavigatorParamList>;
  [ScreensKeys.AuthStack]: NestedNavigatorParams<AuthStackParamList>;
  [ScreensKeys.DefaultLogin]: undefined;
};

const BottomTabNavigator = createBottomTabNavigator<BottomTabNavigatorParamList>();

export const BottomTabs = (): React.ReactElement => {
  const { t } = useTranslation();
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);
  const dispatch = useDispatch();

  const initialRoute = isLoggedIn ? ScreensKeys.Dashboard : ScreensKeys.Search;

  return (
    <BottomTabNavigator.Navigator
      initialRouteName={initialRoute}
      tabBarOptions={{
        activeTintColor: theme.colors.primaryColor,
        keyboardHidesTabBar: true,
        labelStyle: {
          marginBottom: 4,
        },
        style: {
          height: PlatformUtils.isIOS() ? theme.viewport.height * 0.1 : 60,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 8,
        },
      }}
    >
      <BottomTabNavigator.Screen
        name={ScreensKeys.Dashboard}
        component={isLoggedIn ? DashboardStack : DefaultLogin}
        listeners={({ navigation }): any => ({
          tabPress: (e: any): void => resetStackOnTabPress(e, navigation),
          focus: (e: any): void => {
            resetStackOnTabPress(e, navigation);
          },
        })}
        options={({ route }): any => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: t('landing:home'),
          tabBarIcon: ({ focused }: { focused: boolean }): React.ReactElement => {
            return focused ? <Focused /> : <Unfocused />;
          },
        })}
      />
      <BottomTabNavigator.Screen
        name={ScreensKeys.Portfolio}
        component={isLoggedIn ? PortfolioStack : DefaultLogin}
        listeners={({ navigation }): any => ({
          blur: (): void => {
            dispatch(PortfolioActions.setInitialState());
            dispatch(CommonActions.clearMessages());
          },
          focus: (e: any): void => {
            resetStackOnTabPress(e, navigation);
          },
          tabPress: (e: any): void => resetStackOnTabPress(e, navigation),
        })}
        options={({ route }): any => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: t('common:properties'),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }): React.ReactElement => {
            return focused ? (
              <Icon name={icons.portfolioFilled} color={color} size={22} />
            ) : (
              <Icon name={icons.portfolio} color={color} size={22} />
            );
          },
        })}
      />
      <BottomTabNavigator.Screen
        name={ScreensKeys.Financials}
        component={isLoggedIn ? FinancialsStack : DefaultLogin}
        listeners={({ navigation }): any => ({
          tabPress: (e: any): void => resetStackOnTabPress(e, navigation),
          focus: (e: any): void => {
            resetStackOnTabPress(e, navigation);
            dispatch(FinancialActions.clearFinancials());
          },
          blur: (): void => {
            dispatch(FinancialActions.clearFinancials());
          },
        })}
        options={({ route }): any => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: t('assetFinancial:financial'),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }): React.ReactElement => {
            return focused ? (
              <Icon name={icons.barChartFilled} color={color} size={22} />
            ) : (
              <Icon name={icons.barChartOutline} color={color} size={22} />
            );
          },
        })}
      />
      <BottomTabNavigator.Screen
        name={ScreensKeys.Service}
        component={ServiceStack}
        listeners={({ navigation }): any => ({
          tabPress: (e: any): void => resetStackOnTabPress(e, navigation),
          focus: (e: any): void => {
            resetStackOnTabPress(e, navigation);
          },
        })}
        options={({ route }): any => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: t('common:marketPlace'),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }): React.ReactElement => {
            return focused ? (
              <Icon name={icons.marketPlace} color={color} size={26} />
            ) : (
              <Icon name={icons.marketPlace} color={color} size={22} />
            );
          },
        })}
      />
      <BottomTabNavigator.Screen
        name={ScreensKeys.More}
        component={isLoggedIn ? MoreStack : DefaultLogin}
        listeners={({ navigation }): any => ({
          blur: (): void => {
            dispatch(CommonActions.clearMessages());
            dispatch(OfferActions.clearState());
          },
          focus: (e: any): void => {
            resetStackOnTabPress(e, navigation);
          },
          tabPress: (e: any): void => resetStackOnTabPress(e, navigation),
        })}
        options={({ route }): any => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: t('assetMore:more'),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }): React.ReactElement => {
            return focused ? (
              <Icon name={icons.threeDots} color={color} size={22} />
            ) : (
              <Icon name={icons.threeDotsUnfilled} color={color} size={22} />
            );
          },
        })}
      />
    </BottomTabNavigator.Navigator>
  );
};

/**
 * Get tab visibility for specific screens
 * @param route
 */
const getTabBarVisibility = (route: any): boolean => {
  const currentRouteName = getFocusedRouteNameFromRoute(route) ?? '';

  const notAllowedRoutes = [
    ScreensKeys.PropertyAssetDescription,
    ScreensKeys.AssetReviews,
    ScreensKeys.ContactForm,
    ScreensKeys.AuthStack,
    ScreensKeys.BookVisit,
    ScreensKeys.PropertyFilters,
    ScreensKeys.PropertyPostStack,
    ScreensKeys.AssetNeighbourhood,
    ScreensKeys.ChatScreen,
    ScreensKeys.GroupChatInfo,
    ScreensKeys.ServiceTicketDetail,
    ScreensKeys.AddServiceTicket,
    ScreensKeys.ReassignTicket,
    ScreensKeys.SubmitQuote,
    ScreensKeys.ApproveQuote,
    ScreensKeys.WorkCompleted,
    ScreensKeys.WorkInitiated,
    ScreensKeys.UpdateTicketStatus,
    ScreensKeys.RejectTicket,
    ScreensKeys.ProspectProfile,
    ScreensKeys.SubmitOffer,
    ScreensKeys.AcceptOffer,
    ScreensKeys.RejectOffer,
    ScreensKeys.OfferDetail,
    ScreensKeys.WebViewScreen,
    ScreensKeys.SupportScreen,
    ScreensKeys.AssetPlanSelection,
    ScreensKeys.AssetDetailScreen,
    ScreensKeys.AssetFinancialScreen,
    ScreensKeys.DocumentScreen,
    ScreensKeys.PropertyVisits,
    ScreensKeys.ServiceTicketScreen,
    ScreensKeys.AssetReviewScreen,
    ScreensKeys.TenantHistoryScreen,
    ScreensKeys.ServicesForSelectedAsset,
    ScreensKeys.Messages,
    ScreensKeys.AddPropertyImage,
    ScreensKeys.AssetNotifications,
    ScreensKeys.ReminderScreen,
    ScreensKeys.AddReminderScreen,
    ScreensKeys.DuesScreen,
    ScreensKeys.DuesOrderSummary,
    ScreensKeys.AddBankAccount,
    ScreensKeys.TransactionsScreen,
    ScreensKeys.BankDetails,
    ScreensKeys.RequestQuote,
    ScreensKeys.QuotePayment,
    ScreensKeys.PropertyPayment,
    ScreensKeys.PaymentServices,
    ScreensKeys.SocietyController,
    ScreensKeys.ComingSoonScreen,
    ScreensKeys.SocietyOrderSummary,
    ScreensKeys.ServiceSelection,
    ScreensKeys.ValueAddedServices,
    ScreensKeys.ServicePayment,
  ];
  return !notAllowedRoutes.includes(currentRouteName as ScreensKeys);
};

const resetStackOnTabPress = (e, navigation): void => {
  const state = navigation.dangerouslyGetState();

  if (state) {
    // Grab all the tabs that are NOT the one we just pressed
    const nonTargetTabs = state.routes.filter((r) => r.key !== e.target);

    nonTargetTabs.forEach((tab) => {
      // Find the tab we want to reset and grab the key of the nested stack
      const stackKey = tab?.state?.key;

      if (stackKey) {
        // Pass the stack key that we want to reset and use popToTop to reset it
        navigation.dispatch({
          ...StackActions.popToTop(),
          target: stackKey,
        });
      }
    });
  }
};
