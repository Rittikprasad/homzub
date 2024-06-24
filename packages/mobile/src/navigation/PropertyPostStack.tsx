import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { CommonParamList, getCommonScreen } from '@homzhub/mobile/src/navigation/Common';
import PostAssetDetails from '@homzhub/mobile/src/screens/Asset/Record/PostAssetDetails';
import {
  IAssetLocationMapProps,
  ScreensKeys,
  IPostAssetDetailsProps,
  IListingNavParam,
  IProjectSelectionProps,
} from '@homzhub/mobile/src/navigation/interfaces';
import AssetLocationMap from '@homzhub/mobile/src/screens/Asset/Record/AssetLocationMap';
import AssetLocationSearch from '@homzhub/mobile/src/screens/Asset/Record/AssetLocationSearch';
import AddProperty from '@homzhub/mobile/src/screens/Asset/Record/AddProperty';
import AssetListing from '@homzhub/mobile/src/screens/Asset/Record/AssetListing';
import ProjectSelection from '@homzhub/mobile/src/screens/Asset/Record/ProjectSelection';

export type PropertyPostStackParamList = {
  [ScreensKeys.AssetLocationSearch]: undefined | { isFromPortfolio: boolean };
  [ScreensKeys.AssetLocationMap]: IAssetLocationMapProps;
  [ScreensKeys.PostAssetDetails]: IPostAssetDetailsProps | { status: string } | undefined;
  [ScreensKeys.AddProperty]: undefined | { previousScreen: string };
  [ScreensKeys.AssetListing]: undefined | IListingNavParam;
  [ScreensKeys.ProjectSelection]: IProjectSelectionProps;
} & CommonParamList;

const PropertyPostStackNavigator = createStackNavigator<PropertyPostStackParamList>();
const commonScreen = getCommonScreen(PropertyPostStackNavigator);

export const PropertyPostStack = (): React.ReactElement => {
  return (
    <PropertyPostStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <PropertyPostStackNavigator.Screen name={ScreensKeys.AssetLocationSearch} component={AssetLocationSearch} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.AssetLocationMap} component={AssetLocationMap} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.PostAssetDetails} component={PostAssetDetails} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.AssetListing} component={AssetListing} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.AddProperty} component={AddProperty} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.ProjectSelection} component={ProjectSelection} />
      {commonScreen}
    </PropertyPostStackNavigator.Navigator>
  );
};
