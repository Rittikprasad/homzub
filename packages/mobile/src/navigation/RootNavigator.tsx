import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';
import { NavigationContainer } from '@react-navigation/native';
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { NotificationService } from '@homzhub/mobile/src/services/NotificationService';
import { NavigationService } from '@homzhub/mobile/src/services/NavigationService';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { GuestStack } from '@homzhub/mobile/src/navigation/GuestStack';
import { AppNavigator } from '@homzhub/mobile/src/navigation/AppNavigator';

interface IProps {
  booting: boolean;
}

export const RootNavigator = (props: IProps): React.ReactElement | null => {
  const { booting } = props;
  const redirectionDetails = useSelector(CommonSelectors.getRedirectionDetails);
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);
  const isChangeStack = useSelector(UserSelector.getIsChangeStack);
  const searchAddress = useSelector(SearchSelector.getSearchAddress);
  const dispatch = useDispatch();

  // Fetch all user data as soon as user logs in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(UserActions.getUserPreferences());
      dispatch(UserActions.getUserProfile());
      dispatch(UserActions.getFavouriteProperties());
      dispatch(UserActions.getAssets());
      dispatch(UserActions.getUserSubscriptions());
      NotificationService.postDeviceToken();
    }

    GeolocationService.setLocationDetails(isLoggedIn, searchAddress).then();
  }, [isLoggedIn]);

  // Once booting is completed hide the native splash and render our RootNavigator
  useEffect(() => {
    if (!booting) {
      RNBootSplash.hide();
    }
  }, [booting]);

  if (booting) return null;

  return (
    <NavigationContainer
      ref={NavigationService.setTopLevelNavigator}
      onReady={(): void => {
        NavigationService.handleDynamicLinkNavigation(redirectionDetails as IRedirectionDetails).then();
      }}
    >
      {isLoggedIn && isChangeStack ? <AppNavigator /> : <GuestStack />}
    </NavigationContainer>
  );
};
