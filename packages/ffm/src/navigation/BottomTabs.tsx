import React from 'react';
import { useTranslation } from 'react-i18next';
import { getFocusedRouteNameFromRoute } from '@react-navigation/core';
import { StackActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import Focused from '@homzhub/common/src/assets/images/homzhubLogo.svg';
import Unfocused from '@homzhub/common/src/assets/images/homzhubLogoUnfocused.svg';
import { theme } from '@homzhub/common/src/styles/theme';
import DashboardStack from '@homzhub/ffm/src/navigation/DashboardStack';
import MoreStack from '@homzhub/ffm/src/navigation/MoreStack';
import ReportStack from '@homzhub/ffm/src/navigation/ReportStack';
import RequestStack from '@homzhub/ffm/src/navigation/RequestStack';
import VisitStack from '@homzhub/ffm/src/navigation/VisitStack';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type BottomTabNavigatorParamList = {
  [ScreenKeys.Dashboard]: undefined;
  [ScreenKeys.SiteVisits]: undefined;
  [ScreenKeys.Requests]: undefined;
  [ScreenKeys.Supplies]: undefined;
  [ScreenKeys.More]: undefined;
};

const BottomTabNavigator = createBottomTabNavigator<BottomTabNavigatorParamList>();

const BottomTabs = (): React.ReactElement => {
  const { t } = useTranslation();
  return (
    <BottomTabNavigator.Navigator
      initialRouteName={ScreenKeys.Dashboard}
      tabBarOptions={{
        activeTintColor: theme.colors.primaryColor,
        inactiveTintColor: theme.colors.darkTint7,
        style: {
          height: PlatformUtils.isIOS() ? theme.viewport.height * 0.1 : 60,
          ...(PlatformUtils.isAndroid() && { paddingTop: 10 }),
          ...(PlatformUtils.isAndroid() && { paddingBottom: 10 }),
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
        name={ScreenKeys.Dashboard}
        component={DashboardStack}
        listeners={({ navigation }): any => ({
          focus: (e: any): void => {
            resetStackOnTabPress(e, navigation);
          },
        })}
        options={({ route }): any => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: t('assetDashboard:dashboard'),
          tabBarIcon: ({ focused }: { focused: boolean }): React.ReactElement => {
            return focused ? <Focused /> : <Unfocused />;
          },
        })}
      />
      <BottomTabNavigator.Screen
        name={ScreenKeys.SiteVisits}
        component={VisitStack}
        listeners={({ navigation }): any => ({
          focus: (e: any): void => {
            resetStackOnTabPress(e, navigation);
          },
        })}
        options={({ route }): any => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: t('property:siteVisits'),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }): React.ReactElement => {
            return <Icon name={icons.visit} color={color} size={focused ? 24 : 20} />;
          },
        })}
      />
      <BottomTabNavigator.Screen
        name={ScreenKeys.Requests}
        component={RequestStack}
        listeners={({ navigation }): any => ({
          focus: (e: any): void => {
            resetStackOnTabPress(e, navigation);
          },
        })}
        options={({ route }): any => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: t('assetDashboard:tickets'),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }): React.ReactElement => {
            return <Icon name={icons.serviceRequest} color={color} size={focused ? 24 : 20} />;
          },
        })}
      />
      <BottomTabNavigator.Screen
        name={ScreenKeys.Reports}
        component={ReportStack}
        listeners={({ navigation }): any => ({
          focus: (e: any): void => {
            resetStackOnTabPress(e, navigation);
          },
        })}
        options={({ route }): any => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: t('reports:reports'),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }): React.ReactElement => {
            return <Icon name={icons.barChartOutline} color={color} size={focused ? 24 : 20} />;
          },
        })}
      />
      <BottomTabNavigator.Screen
        name={ScreenKeys.More}
        component={MoreStack}
        listeners={({ navigation }): any => ({
          focus: (e: any): void => {
            resetStackOnTabPress(e, navigation);
          },
        })}
        options={({ route }): any => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: t('assetMore:more'),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }): React.ReactElement => {
            return <Icon name={icons.threeDots} color={color} size={focused ? 24 : 20} />;
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
    ScreenKeys.InspectionSelection,
    ScreenKeys.ReportLocationMap,
    ScreenKeys.HotProperties,
    ScreenKeys.RequestDetail,
    ScreenKeys.SubmitQuote,
    ScreenKeys.WorkInitiated,
    ScreenKeys.SendUpdate,
    ScreenKeys.WorkCompleted,
    ScreenKeys.UpdateUserProfile,
  ];
  return !notAllowedRoutes.includes(currentRouteName as ScreenKeys);
};

const resetStackOnTabPress = (e: any, navigation: any): void => {
  const state = navigation.dangerouslyGetState();

  if (state) {
    // Grab all the tabs that are NOT the one we just pressed
    const nonTargetTabs = state.routes.filter((r: any) => r.key !== e.target);

    nonTargetTabs.forEach((tab: any) => {
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

export default BottomTabs;
