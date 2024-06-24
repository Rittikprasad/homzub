import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonStackParamList, getCommonScreen } from '@homzhub/ffm/src/navigation/CommonStack';
import SiteVisitDashboard from '@homzhub/ffm/src/screens/SiteVisits';
import FeedbackForm from '@homzhub/ffm/src/screens/SiteVisits/FeedbackForm';
import VisitDetail from '@homzhub/ffm/src/screens/SiteVisits/VisitDetail';
import VisitForm from '@homzhub/ffm/src/screens/SiteVisits/VisitForm';
import { IFeedbackParam, IVisitDetailParam, IVisitParam, ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type VisitStackParamList = {
  [ScreenKeys.SiteVisitDashboard]: undefined;
  [ScreenKeys.VisitForm]: IVisitParam;
  [ScreenKeys.VisitDetail]: IVisitDetailParam;
  [ScreenKeys.FeedbackForm]: IFeedbackParam;
} & CommonStackParamList;

const VisitStackNavigator = createStackNavigator<VisitStackParamList>();
const commonScreen = getCommonScreen(VisitStackNavigator);

const VisitStack = (): React.ReactElement => {
  return (
    <VisitStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <VisitStackNavigator.Screen name={ScreenKeys.SiteVisitDashboard} component={SiteVisitDashboard} />
      <VisitStackNavigator.Screen name={ScreenKeys.VisitForm} component={VisitForm} />
      <VisitStackNavigator.Screen name={ScreenKeys.VisitDetail} component={VisitDetail} />
      <VisitStackNavigator.Screen name={ScreenKeys.FeedbackForm} component={FeedbackForm} />
      {commonScreen}
    </VisitStackNavigator.Navigator>
  );
};

export default VisitStack;
