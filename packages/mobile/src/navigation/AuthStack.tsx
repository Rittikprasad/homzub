import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { CommonParamList, getCommonScreen } from '@homzhub/mobile/src/navigation/Common';
import EmailLoginScreen from '@homzhub/mobile/src/screens/Auth/EmailLoginScreen';
import LoginScreen from '@homzhub/mobile/src/screens/Auth/LoginScreen';
import MobileVerificationScreen from '@homzhub/mobile/src/screens/Auth/MobileVerificationScreen';
import SignUpScreen from '@homzhub/mobile/src/screens/Auth/SignUpScreen';
import {
  ScreensKeys,
  IVerificationProps,
  IScreenCallback,
  ISignUpParams,
} from '@homzhub/mobile/src/navigation/interfaces';

export type AuthStackParamList = {
  [ScreensKeys.SignUp]: ISignUpParams;
  [ScreensKeys.MobileVerification]: IVerificationProps;
  [ScreensKeys.Login]: IScreenCallback;
  [ScreensKeys.EmailLogin]: IScreenCallback | undefined;
} & CommonParamList;

export const AuthStackNavigator = createStackNavigator<AuthStackParamList>();
const commonScreen = getCommonScreen(AuthStackNavigator);

export function AuthStack(): React.ReactElement {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <AuthStackNavigator.Screen name={ScreensKeys.SignUp} component={SignUpScreen} />
      <AuthStackNavigator.Screen name={ScreensKeys.Login} component={LoginScreen} />
      <AuthStackNavigator.Screen name={ScreensKeys.EmailLogin} component={EmailLoginScreen} />
      <AuthStackNavigator.Screen name={ScreensKeys.MobileVerification} component={MobileVerificationScreen} />
      {commonScreen}
    </AuthStackNavigator.Navigator>
  );
}
