import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { NestedNavigatorParams, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import OnBoardingScreen from '@homzhub/mobile/src/screens/OnBoardingScreen';
import { WrapperSearchStack } from '@homzhub/mobile/src/navigation/WrapperSearchStack';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import {AuthStack} from '@homzhub/mobile/src/navigation/AuthStack';
import { Text, View } from 'react-native';

export type GuestStackNavigatorParamList = {
  [ScreensKeys.OnBoarding]: undefined;
  [ScreensKeys.GettingStarted]: undefined;
  [ScreensKeys.AuthStack]: NestedNavigatorParams<AuthStackParamList>;
  [ScreensKeys.SearchStack]: undefined;
};

const GuestStackNavigator = createStackNavigator<GuestStackNavigatorParamList>();
const Stack = createStackNavigator();

export function GuestStack(): React.ReactElement {
  return (
    <GuestStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <GuestStackNavigator.Screen name={ScreensKeys.OnBoarding} component={OnBoardingScreen} />
      <GuestStackNavigator.Screen name={ScreensKeys.AuthStack} component={AuthStack} />
      <GuestStackNavigator.Screen name={ScreensKeys.SearchStack} component={WrapperSearchStack} />
    </GuestStackNavigator.Navigator>
  );
}
