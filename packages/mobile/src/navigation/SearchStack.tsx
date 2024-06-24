import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonParamList, getCommonScreen } from '@homzhub/mobile/src/navigation/Common';
import { AuthStack, AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import AssetNeighbourhood from '@homzhub/mobile/src/screens/Asset/Search/AssetNeighbourhood';
import { AssetReviews } from '@homzhub/mobile/src/screens/Asset/Search/AssetReviews';
import ContactForm from '@homzhub/mobile/src/screens/Asset/Search/ContactForm';
import AssetFilters from '@homzhub/mobile/src/screens/Asset/Search/AssetFilters';
import AssetSearchScreen from '@homzhub/mobile/src/screens/Asset/Search/AssetSearchScreen';
import { PropertyPostStack, PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { IGetListingReviews } from '@homzhub/common/src/domain/repositories/interfaces';
import { ScreensKeys, IContactProps, NestedNavigatorParams } from '@homzhub/mobile/src/navigation/interfaces';

export type SearchStackParamList = {
  [ScreensKeys.PropertySearchScreen]: undefined;
  [ScreensKeys.AuthStack]: NestedNavigatorParams<AuthStackParamList>;
  [ScreensKeys.AssetNeighbourhood]: undefined;
  [ScreensKeys.PropertyFilters]: undefined;
  [ScreensKeys.ContactForm]: IContactProps;
  [ScreensKeys.PropertyPostStack]: NestedNavigatorParams<PropertyPostStackParamList>;
  [ScreensKeys.AssetReviews]: IGetListingReviews;
} & CommonParamList;

const SearchStackNavigator = createStackNavigator<SearchStackParamList>();
const commonScreen = getCommonScreen(SearchStackNavigator);

export const SearchStack = (): React.ReactElement => {
  return (
    <SearchStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
      mode="modal"
    >
      <SearchStackNavigator.Screen name={ScreensKeys.PropertySearchScreen} component={AssetSearchScreen} />
      <SearchStackNavigator.Screen name={ScreensKeys.AssetReviews} component={AssetReviews} />
      <SearchStackNavigator.Screen name={ScreensKeys.AuthStack} component={AuthStack} />
      <SearchStackNavigator.Screen name={ScreensKeys.AssetNeighbourhood} component={AssetNeighbourhood} />
      <SearchStackNavigator.Screen name={ScreensKeys.PropertyFilters} component={AssetFilters} />
      <SearchStackNavigator.Screen name={ScreensKeys.ContactForm} component={ContactForm} />
      <SearchStackNavigator.Screen name={ScreensKeys.PropertyPostStack} component={PropertyPostStack} />
      {commonScreen}
    </SearchStackNavigator.Navigator>
  );
};
