import React from 'react';
import { useSelector } from 'react-redux';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { BottomTabNavigatorParamList, BottomTabs } from '@homzhub/mobile/src/navigation/BottomTabs';
import { CommonParamList, getCommonScreen } from '@homzhub/mobile/src/navigation/Common';
import { PropertyPostStack, PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { NestedNavigatorParams, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import UpdatePropertyListing from '@homzhub/mobile/src/screens/Asset/Portfolio/UpdatePropertyListing';
export type AppStackParamList = {
  [ScreensKeys.BottomTabs]: NestedNavigatorParams<BottomTabNavigatorParamList>;
  [ScreensKeys.PropertyPostStack]: NestedNavigatorParams<PropertyPostStackParamList>;
} & CommonParamList;

const AppStackNavigator = createStackNavigator<AppStackParamList>();
const commonScreen = getCommonScreen(AppStackNavigator);

export function AppNavigator(): React.ReactElement {
  const isAddPropertyFlow = useSelector(UserSelector.isAddPropertyFlow);

  return (
    <AppStackNavigator.Navigator
      initialRouteName={isAddPropertyFlow ? ScreensKeys.LandingScreen : ScreensKeys.BottomTabs}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <AppStackNavigator.Screen name={ScreensKeys.BottomTabs} component={BottomTabs} />
      <AppStackNavigator.Screen name={ScreensKeys.PropertyPostStack} component={PropertyPostStack} />
      <AppStackNavigator.Screen name={ScreensKeys.UpdatePropertyScreen} component={UpdatePropertyListing} />
      {commonScreen}
    </AppStackNavigator.Navigator>
  );
}
