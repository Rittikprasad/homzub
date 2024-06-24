import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from '@homzhub/ffm/src/navigation/BottomTabs';
import OnBoarding from '@homzhub/ffm/src/screens/Common/OnBoarding';
import WorkLocations from '@homzhub/ffm/src/screens/Auth/WorkLocations';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
import AuthStack from '@homzhub/ffm/src/navigation/AuthStack';

type AppStackParamList = {
  [ScreenKeys.BottomTab]: undefined;
};

const AppStackNavigator = createStackNavigator<AppStackParamList>();

const AppStack = (): React.ReactElement => {
  return (
    <AppStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <AppStackNavigator.Screen name={ScreenKeys.BottomTab} component={BottomTabs} />
      <AppStackNavigator.Screen name={ScreenKeys.AuthStack} component={AuthStack} />
    </AppStackNavigator.Navigator>
  );
};

export default AppStack;
