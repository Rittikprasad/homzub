import React, { FC, useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import BasicInformations from '@homzhub/web/src/screens/profile/components/BasicInformations';
import EditProfileModal from '@homzhub/web/src/screens/profile/components/EditProfileModal';
import ProfilePhoto from '@homzhub/web/src/screens/profile/components/ProfilePhoto';
import ProfilePopover, { ProfileUserFormTypes } from '@homzhub/web/src/screens/profile/components/ProfilePopover';
import WorkDetails from '@homzhub/web/src/screens/profile/components/WorkDetails';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IDispatchProps {
  getUserProfile: () => void;
}
interface IStateProps {
  userProfile: UserProfileModel;
  isLoading: boolean;
}
type IProps = IStateProps & IDispatchProps;

const ProfileContainer: FC<IProps> = (props: IProps) => {
  const { getUserProfile, userProfile } = props;
  const popupRef = useRef<PopupActions>(null);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const [formType, setFormType] = useState<ProfileUserFormTypes>(ProfileUserFormTypes.ChangePassword);
  const [renderPopup, setRenderPopup] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    getUserProfile();
  }, []);

  const updatePopUpState = (data: string): void => {
    setRenderPopup(data);
  };

  const openEditModal = (status: boolean): void => {
    setIsOpen(status);
  };

  const renderChangePassword = (): React.ReactElement => {
    return (
      <View style={[styles.innerContainer, isTablet && styles.innerContainerTab, isMobile && styles.innerContainerMob]}>
        <Text type="small" textType="semiBold">
          {t('moreProfile:changePassword')}
        </Text>
        <Icon size={20} name={icons.rightArrow} color={theme.colors.primaryColor} />
      </View>
    );
  };

  const openModal = (type: ProfileUserFormTypes): void => {
    setFormType(type);
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };

  return (
    <View style={[styles.container, (isTablet || isMobile) && styles.containerTab]}>
      <ProfilePhoto userProfileInfo={userProfile} getUserProfile={getUserProfile} />
      {isOpen && (
        <EditProfileModal
          userProfileInfo={userProfile}
          renderPopup={renderPopup}
          updatePopUp={updatePopUpState}
          openEditModal={openEditModal}
          updateUserProfile={getUserProfile}
        />
      )}
      <View style={isTablet && styles.subContainerTab}>
        <View style={isTablet && styles.basicInfoTab}>
          <BasicInformations userProfileInfo={userProfile} openEditModal={openEditModal} />
          {userProfile && userProfile.isPasswordCreated ? (
            <TouchableOpacity
              style={[styles.changePassword, isTablet && styles.changePasswordTab]}
              onPress={(): void => openModal(ProfileUserFormTypes.ChangePassword)}
            >
              {renderChangePassword()}
            </TouchableOpacity>
          ) : (
            <View style={[styles.changePassword, isTablet && styles.changePasswordTab]}>{renderChangePassword()}</View>
          )}
        </View>
        <View style={isTablet && styles.workDetailTab}>
          <WorkDetails userProfileInfo={userProfile} />
        </View>
        <ProfilePopover popupRef={popupRef} formType={formType} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 359,
  },
  containerTab: {
    width: '100%',
  },

  innerContainerTab: {
    marginVertical: 16,
  },
  innerContainerMob: {
    marginHorizontal: 16,
  },
  changePassword: {
    backgroundColor: theme.colors.white,
  },
  changePasswordTab: {
    top: 16,
  },
  innerContainer: {
    marginHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subContainerTab: {
    flexDirection: 'row',
    top: 16,
  },

  basicInfoTab: {
    width: '48.7%',
  },
  workDetailTab: {
    width: '48.7%',
    left: 18,
  },
});
const mapStateToProps = (state: IState): IStateProps => {
  const { getUserProfile, isUserProfileLoading } = UserSelector;
  return {
    userProfile: getUserProfile(state),
    isLoading: isUserProfileLoading(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getUserProfile } = UserActions;
  return bindActionCreators({ getUserProfile }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
