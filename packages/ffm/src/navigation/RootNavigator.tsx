import React, { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { NotificationService } from '@homzhub/ffm/src/services/NotificationService';
import { IRedirectionDetails } from '@homzhub/ffm/src/services/LinkingService';
import { NavigationService } from '@homzhub/ffm/src/services/NavigationService';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import AppStack from '@homzhub/ffm/src/navigation/AppStack';
import AuthStack from '@homzhub/ffm/src/navigation/AuthStack';

interface IProps {
  booting: boolean;
}

export const RootNavigator = ({ booting }: IProps): React.ReactElement => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);
  const redirectionDetails = useSelector(CommonSelectors.getRedirectionDetails);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(UserActions.getUserProfile());
      NotificationService.postDeviceToken();
    }
    GeolocationService.setLocationDetails(false, '').then();
  }, [isLoggedIn]);

  useEffect(() => {
    console.log("bvascgfasbvnbasvg####")
    if (!booting) {
      RNBootSplash.hide({fade:true});
    }
  }, [booting]);

  return (
    <NavigationContainer
      ref={NavigationService.setTopLevelNavigator}
      onReady={(): void => {
        NavigationService.handleDynamicLinkNavigation(redirectionDetails as IRedirectionDetails).then();
      }}
    >
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
