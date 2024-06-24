import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonStackParamList, getCommonScreen } from '@homzhub/ffm/src/navigation/CommonStack';
import Dashboard from '@homzhub/ffm/src/screens/Dashboard';
import HotProperties from '@homzhub/ffm/src/screens/Dashboard/HotProperties';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type DashboardStackParamList = {
  [ScreenKeys.DashboardScreen]: undefined;
  [ScreenKeys.HotProperties]: undefined;
} & CommonStackParamList;

const DashboardStackNavigator = createStackNavigator<DashboardStackParamList>();
const commonScreen = getCommonScreen(DashboardStackNavigator);

const DashboardStack = (): React.ReactElement => {
  return (
    <DashboardStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStackNavigator.Screen name={ScreenKeys.DashboardScreen} component={Dashboard} />
      <DashboardStackNavigator.Screen name={ScreenKeys.HotProperties} component={HotProperties} />
      {commonScreen}
    </DashboardStackNavigator.Navigator>
  );
};

export default DashboardStack;
