import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { CommonParamList, getCommonScreen } from '@homzhub/mobile/src/navigation/Common';
import Dashboard from '@homzhub/mobile/src/screens/Asset/Dashboard';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

export type DashboardNavigatorParamList = {
  [ScreensKeys.DashboardLandingScreen]: undefined | { imageLink?: string };
} & CommonParamList;

const DashboardNavigator = createStackNavigator<DashboardNavigatorParamList>();
const commonScreen = getCommonScreen(DashboardNavigator);

export const DashboardStack = (): React.ReactElement => {
  return (
    <DashboardNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <DashboardNavigator.Screen name={ScreensKeys.DashboardLandingScreen} component={Dashboard} />
      {commonScreen}
    </DashboardNavigator.Navigator>
  );
};
