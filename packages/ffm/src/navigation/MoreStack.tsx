import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MoreScreen from '@homzhub/ffm/src/screens/More';
import { CommonStackParamList, getCommonScreen } from '@homzhub/ffm/src/navigation/CommonStack';
import ReportStack from '@homzhub/ffm/src/navigation/ReportStack';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type MoreStackParamList = {
  [ScreenKeys.MoreScreen]: undefined;
  [ScreenKeys.Reports]: undefined;
} & CommonStackParamList;

const MoreStackNavigator = createStackNavigator<MoreStackParamList>();
const commonScreen = getCommonScreen(MoreStackNavigator);

const MoreStack = (): React.ReactElement => {
  return (
    <MoreStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <MoreStackNavigator.Screen name={ScreenKeys.MoreScreen} component={MoreScreen} />
      <MoreStackNavigator.Screen name={ScreenKeys.Reports} component={ReportStack} />
      {commonScreen}
    </MoreStackNavigator.Navigator>
  );
};

export default MoreStack;
