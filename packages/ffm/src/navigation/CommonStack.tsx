import React from 'react';
import ComingSoon from '@homzhub/ffm/src/screens/Common/ComingSoon';
import MobileVerification from '@homzhub/ffm/src/screens/Auth/MobileVerification';
import UserProfile from '@homzhub/ffm/src/screens/More/UserProfile';
import UpdatePassword from '@homzhub/ffm/src/screens/More/UpdatePassword';
import UpdateUserProfile from '@homzhub/ffm/src/screens/More/UpdateUserProfile';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
import { IOtpNavProps, IUpdateProfileProps } from '@homzhub/mobile/src/navigation/interfaces';

export type CommonStackParamList = {
  [ScreenKeys.ComingSoon]: undefined;
  [ScreenKeys.UserProfile]: undefined;
  [ScreenKeys.UpdateUserProfile]: IUpdateProfileProps;
  [ScreenKeys.UpdatePassword]: IUpdateProfileProps;
  [ScreenKeys.MobileVerification]: IOtpNavProps;
};

/**
 * Common Screen for multiple stacks
 * @param Stack
 */

export const getCommonScreen = (Stack: any): React.ReactElement => {
  return (
    <>
      <Stack.Screen name={ScreenKeys.ComingSoon} component={ComingSoon} />
      <Stack.Screen name={ScreenKeys.UserProfile} component={UserProfile} />
      <Stack.Screen name={ScreenKeys.UpdateUserProfile} component={UpdateUserProfile} />
      <Stack.Screen name={ScreenKeys.UpdatePassword} component={UpdatePassword} />
      <Stack.Screen name={ScreenKeys.MobileVerification} component={MobileVerification} />
    </>
  );
};
