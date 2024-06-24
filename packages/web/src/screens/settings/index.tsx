import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector, connect, ConnectedProps } from 'react-redux';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import SettingsTab from '@homzhub/web/src/screens/settings/components/SettingsTab';
import SettingsMobile from '@homzhub/web/src/screens/settings/components/SettingsMobile';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

export const Settings: FC<SettingsProps> = (props: SettingsProps) => {
  const { userPreferences } = props;
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(UserActions.getUserPreferences());
    }
  }, []);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  return userPreferences && (!isMobile ? <SettingsTab /> : <SettingsMobile />);
};
const mapStateToProps = (state: IState): any => {
  const { getUserPreferences, isUserPreferencesLoading } = UserSelector;
  return {
    userPreferences: getUserPreferences(state),
    isUserPreferencesLoading: isUserPreferencesLoading(state),
  };
};
const connector = connect(mapStateToProps, null);
type SettingsProps = ConnectedProps<typeof connector>;
export default connector(Settings);
