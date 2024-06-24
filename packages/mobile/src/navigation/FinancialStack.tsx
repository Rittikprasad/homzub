import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { CommonParamList, getCommonScreen } from '@homzhub/mobile/src/navigation/Common';
import Financials from '@homzhub/mobile/src/screens/Asset/Financials';
import AddReminderScreen from '@homzhub/mobile/src/screens/Asset/Financials/AddReminderScreen';
import DuesOrderSummary from '@homzhub/mobile/src/screens/Asset/Financials/DuesOrderSummary';
import ReminderScreen from '@homzhub/mobile/src/screens/Asset/Financials/ReminderScreen';
import TransactionsScreen from '@homzhub/mobile/src/screens/Asset/Financials/TransactionsScreen';
import { IAddReminder, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

export type FinancialsNavigatorParamList = {
  [ScreensKeys.FinancialsLandingScreen]: undefined | { isFromNavigation: boolean };
  [ScreensKeys.AddReminderScreen]: undefined;
  [ScreensKeys.ReminderScreen]: undefined | IAddReminder;
  [ScreensKeys.DuesOrderSummary]: undefined;
  [ScreensKeys.TransactionsScreen]: undefined;
} & CommonParamList;

const FinancialsNavigator = createStackNavigator<FinancialsNavigatorParamList>();
const commonScreen = getCommonScreen(FinancialsNavigator);

export const FinancialsStack = (): React.ReactElement => {
  return (
    <FinancialsNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <FinancialsNavigator.Screen name={ScreensKeys.FinancialsLandingScreen} component={Financials} />
      <FinancialsNavigator.Screen name={ScreensKeys.AddReminderScreen} component={AddReminderScreen} />
      <FinancialsNavigator.Screen name={ScreensKeys.ReminderScreen} component={ReminderScreen} />
      <FinancialsNavigator.Screen name={ScreensKeys.DuesOrderSummary} component={DuesOrderSummary} />
      <FinancialsNavigator.Screen name={ScreensKeys.TransactionsScreen} component={TransactionsScreen} />
      {commonScreen}
    </FinancialsNavigator.Navigator>
  );
};
