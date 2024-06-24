import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabs } from '@homzhub/mobile/src/navigation/BottomTabs';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import AssetSearchLanding from '@homzhub/mobile/src/screens/Asset/Search/AssetSearchLanding';
import { SearchStack } from '@homzhub/mobile/src/navigation/SearchStack';

export type WrapperSearchStackParamList = {
  [ScreensKeys.PropertySearchLanding]: undefined;
  [ScreensKeys.BottomTabs]: undefined;
  [ScreensKeys.Search]: undefined;
};

const WrapperSearchStackNavigator = createStackNavigator<WrapperSearchStackParamList>();

export const WrapperSearchStack = (): React.ReactElement => {
  return (
    <WrapperSearchStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <WrapperSearchStackNavigator.Screen name={ScreensKeys.PropertySearchLanding} component={AssetSearchLanding} />
      <WrapperSearchStackNavigator.Screen name={ScreensKeys.Search} component={SearchStack} />
      <WrapperSearchStackNavigator.Screen name={ScreensKeys.BottomTabs} component={BottomTabs} />
    </WrapperSearchStackNavigator.Navigator>
  );
};
