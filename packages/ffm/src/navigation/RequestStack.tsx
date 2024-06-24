import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonStackParamList, getCommonScreen } from '@homzhub/ffm/src/navigation/CommonStack';
import RequestDashboard from '@homzhub/ffm/src/screens/Requests';
import RequestDetail from '@homzhub/ffm/src/screens/Requests/RequestDetail';
import SendUpdate from '@homzhub/ffm/src/screens/Requests/SendUpdate';
import SubmitQuote from '@homzhub/ffm/src/screens/Requests/SubmitQuote';
import WorkCompleted from '@homzhub/ffm/src/screens/Requests/WorkCompleted';
import WorkInitiated from '@homzhub/ffm/src/screens/Requests/WorkInitiated';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type MoreStackParamList = {
  [ScreenKeys.RequestsDashboard]: undefined;
  [ScreenKeys.RequestDetail]: undefined;
  [ScreenKeys.SubmitQuote]: undefined;
  [ScreenKeys.WorkInitiated]: undefined;
  [ScreenKeys.SendUpdate]: undefined;
  [ScreenKeys.WorkCompleted]: undefined;
} & CommonStackParamList;

const RequestStackNavigator = createStackNavigator<MoreStackParamList>();
const commonScreen = getCommonScreen(RequestStackNavigator);

const RequestStack = (): React.ReactElement => {
  return (
    <RequestStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <RequestStackNavigator.Screen name={ScreenKeys.RequestsDashboard} component={RequestDashboard} />
      <RequestStackNavigator.Screen name={ScreenKeys.RequestDetail} component={RequestDetail} />
      <RequestStackNavigator.Screen name={ScreenKeys.SubmitQuote} component={SubmitQuote} />
      <RequestStackNavigator.Screen name={ScreenKeys.WorkInitiated} component={WorkInitiated} />
      <RequestStackNavigator.Screen name={ScreenKeys.SendUpdate} component={SendUpdate} />
      <RequestStackNavigator.Screen name={ScreenKeys.WorkCompleted} component={WorkCompleted} />
      {commonScreen}
    </RequestStackNavigator.Navigator>
  );
};

export default RequestStack;
