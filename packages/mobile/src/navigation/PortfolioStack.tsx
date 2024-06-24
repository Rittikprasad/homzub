import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { CommonParamList, getCommonScreen } from '@homzhub/mobile/src/navigation/Common';
import ManageTenantScreen from '@homzhub/mobile/src/screens/Asset/Portfolio/ManageTenantScreen';
import UpdatePropertyListing from '@homzhub/mobile/src/screens/Asset/Portfolio/UpdatePropertyListing';
import UpdateLeaseTerm from '@homzhub/mobile/src/screens/Asset/Portfolio/UpdateLeaseTerm';
import { IAcceptInvitePayload } from '@homzhub/common/src/domain/repositories/interfaces';
import Portfolio from '@homzhub/mobile/src/screens/Asset/Portfolio';
import {
  IEditLeaseProps,
  IManageTenantProps,
  IUpdatePropertyProps,
  ScreensKeys,
} from '@homzhub/mobile/src/navigation/interfaces';

export type PortfolioNavigatorParamList = {
  [ScreensKeys.PortfolioLandingScreen]: IAcceptInvitePayload;
  [ScreensKeys.PropertyDetailsNotifications]: undefined;
  [ScreensKeys.UpdatePropertyScreen]: IUpdatePropertyProps;
  [ScreensKeys.ManageTenantScreen]: IManageTenantProps;
  [ScreensKeys.UpdateLeaseScreen]: IEditLeaseProps;
} & CommonParamList;

const PortfolioNavigator = createStackNavigator<PortfolioNavigatorParamList>();
const commonScreen = getCommonScreen(PortfolioNavigator);

export const PortfolioStack = (): React.ReactElement => {
  return (
    <PortfolioNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <PortfolioNavigator.Screen name={ScreensKeys.PortfolioLandingScreen} component={Portfolio} />
      <PortfolioNavigator.Screen name={ScreensKeys.UpdatePropertyScreen} component={UpdatePropertyListing} />
      <PortfolioNavigator.Screen name={ScreensKeys.ManageTenantScreen} component={ManageTenantScreen} />
      <PortfolioNavigator.Screen name={ScreensKeys.UpdateLeaseScreen} component={UpdateLeaseTerm} />
      {commonScreen}
    </PortfolioNavigator.Navigator>
  );
};
