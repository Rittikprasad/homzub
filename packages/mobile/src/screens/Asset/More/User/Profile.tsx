import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Progress } from '@homzhub/common/src/components/atoms/Progress/Progress';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { DetailsCard } from '@homzhub/mobile/src/components/molecules/DetailsCard';
import { UpdateUserFormTypes } from '@homzhub/mobile/src/screens/Asset/More/User/UpdateProfile';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { EmailVerificationActions, IEmailVerification } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IDispatchProps {
  getUserProfile: () => void;
  logout: () => void;
  deactivateUserAccount: () => void;
}

interface IStateProps {
  userProfile: UserProfileModel;
  isLoading: boolean;
}

interface IOwnState {
  isBottomSheetOpen: boolean;
  isEmailVerified: boolean;
  isLocalViewLoading: boolean;
  verificationId: string;
}

interface IProps {
  renderScreen: (children: React.ReactElement) => React.ReactElement;
  onUpdateProfile: (title?: string, formType?: UpdateUserFormTypes) => void;
  onChangePassword: () => void;
  verification_id?: number;
}

type IOwnProps = libraryProps & IStateProps & IDispatchProps & IProps & WithTranslation;

class Profile extends React.PureComponent<IOwnProps, IOwnState> {
  public state = {
    isBottomSheetOpen: false,
    isEmailVerified: false,
    isLocalViewLoading: false,
    verificationId: '',
  };

  public async componentDidUpdate(prevProps: Readonly<IOwnProps>, prevState: Readonly<IOwnState>): Promise<void> {
    const { verification_id } = this.props;
    const { verificationId } = this.state;

    if (verification_id && verificationId !== params.verification_id) {
      await this.verifyEmail();
    }
  }

  public render = (): React.ReactElement => {
    const { t, isLoading, renderScreen } = this.props;
    const { isLocalViewLoading, isBottomSheetOpen, isEmailVerified } = this.state;

    return (
      <>
        {renderScreen(this.renderScreenData())}
        <Loader visible={isLoading || isLocalViewLoading} />
        <BottomSheet sheetHeight={400} visible={isBottomSheetOpen} onCloseSheet={this.closeBottomSheet}>
          <View>
            <Text style={styles.commonTextStyle} type="large" textType="semiBold">
              {isEmailVerified ? t('emailVerifiedText') : t('emailNotVerifiedText')}
            </Text>
            <Text style={styles.commonTextStyle} type="small" textType="regular">
              {isEmailVerified ? t('emailVerifiedDescription') : t('emailNotVerifiedDescription')}
            </Text>
            <Icon
              style={[styles.commonTextStyle, styles.iconStyles]}
              size={80}
              name={isEmailVerified ? icons.doubleCheck : icons.filledWarning}
              color={isEmailVerified ? theme.colors.completed : theme.colors.error}
            />
            <Button
              type="primary"
              title={t('common:done')}
              containerStyle={styles.buttonStyle}
              onPress={this.closeBottomSheet}
            />
          </View>
        </BottomSheet>
      </>
    );
  };

  public renderComponent = (): React.ReactNode => {};

  private renderScreenData = (): React.ReactElement | null => {
    const { t, userProfile, onUpdateProfile, onChangePassword } = this.props;

    if (!userProfile) {
      return null;
    }

    const { profileProgress, name, basicDetailsArray, emergencyContactArray, workInfoArray, profilePicture } =
      userProfile;
    return (
      <>
        <View style={styles.container}>
          <View style={styles.profileImage}>
            <Avatar
              isOnlyAvatar
              fullName={name || ''}
              imageSize={80}
              onPressCamera={(): void => onUpdateProfile(t('basicDetails'))}
              image={profilePicture}
            />
          </View>
          <Progress
            containerStyles={styles.progressBar}
            title={t('assetMore:profile')}
            progress={profileProgress || 0}
          />
          <DetailsCard
            headerInfo={{ title: t('basicDetails'), icon: icons.noteBook, onPress: onUpdateProfile }}
            details={basicDetailsArray}
            type={UpdateUserFormTypes.BasicDetails}
            onVerifyPress={this.onVerifyPress}
            showDivider
          />
          <DetailsCard
            headerInfo={{ title: t('changePassword'), icon: icons.rightArrow, onPress: onChangePassword }}
            showDivider
          />
          <DetailsCard
            headerInfo={{
              title: t('emergencyContact'),
              icon: emergencyContactArray ? icons.noteBook : undefined,
              onPress: onUpdateProfile,
            }}
            details={emergencyContactArray}
            type={UpdateUserFormTypes.EmergencyContact}
            showDivider
          />
          <DetailsCard
            headerInfo={{
              title: t('workInformation'),
              icon: workInfoArray ? icons.noteBook : undefined,
              onPress: onUpdateProfile,
            }}
            details={workInfoArray}
            onVerifyPress={this.onVerifyPress}
            type={UpdateUserFormTypes.WorkInfo}
          />
        </View>
        {this.renderLogout()}
      </>
    );
  };

  public confirmDeleteAccount = (): React.ReactElement => {
    const { deactivateUserAccount } = this.props;
    Alert.alert('Homzhub', 'This action cannot be undone. Are you sure you want to delete your account?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => deactivateUserAccount() },
    ]);
  };

  private renderLogout = (): React.ReactElement => {
    const { logout, t, deactivateUserAccount } = this.props;
    return (
      <>
        <TouchableOpacity style={styles.logOutHolder} onPress={logout}>
          <Icon name={icons.logOut} size={22} color={theme.colors.error} style={styles.logOutIcon} />
          <Text type="small" textType="semiBold" style={styles.logOutText} minimumFontScale={0.1} numberOfLines={1}>
            {t('assetMore:logout')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logOutHolder} onPress={this.confirmDeleteAccount}>
          <Icon name={icons.trash} size={22} color={theme.colors.darkGrayishBlue} style={styles.logOutIcon} />
          <Text
            type="small"
            textType="semiBold"
            style={styles.delAccountOutText}
            minimumFontScale={0.1}
            numberOfLines={1}
          >
            {t('assetMore:delAccount')}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  private onVerifyPress = async (email: string, type: UpdateUserFormTypes): Promise<void> => {
    const { t } = this.props;

    const payload: IEmailVerification = {
      action: EmailVerificationActions.GET_VERIFICATION_EMAIL,
      payload: {
        email,
        is_work_email: type !== UpdateUserFormTypes.BasicDetails,
      },
    };

    try {
      await UserRepository.sendOrVerifyEmail(payload);
      AlertHelper.info({ message: t('emailVerificationSetAlert', { email }) });
    }catch (e: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private verifyEmail = async (): Promise<void> => {
    const {
      route: {
        params: { verification_id },
      },
      getUserProfile,
    } = this.props;
    this.setState({ isLocalViewLoading: true, verificationId: verification_id });

    const payload: IEmailVerification = {
      action: EmailVerificationActions.VERIFY_EMAIL,
      payload: {
        verification_id,
      },
    };

    try {
      await UserRepository.sendOrVerifyEmail(payload);
      getUserProfile();
      this.setState({ isBottomSheetOpen: true, isEmailVerified: true, isLocalViewLoading: false });
    }catch (e: any) {      this.setState({ isBottomSheetOpen: true, isEmailVerified: false, isLocalViewLoading: false });
    }
  };

  private closeBottomSheet = (): void => {
    this.setState({ isBottomSheetOpen: false });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserProfile, isUserProfileLoading } = UserSelector;
  return {
    userProfile: getUserProfile(state),
    isLoading: isUserProfileLoading(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getUserProfile, logout, deactivateUserAccount } = UserActions;
  return bindActionCreators({ getUserProfile, logout, deactivateUserAccount }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.moreProfile)(Profile));

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
  },
  profileImage: {
    marginTop: 18,
    alignItems: 'center',
  },
  progressBar: {
    marginBottom: 24,
  },
  buttonStyle: {
    flex: 0,
    marginHorizontal: theme.layout.screenPadding,
  },
  commonTextStyle: {
    textAlign: 'center',
  },
  iconStyles: {
    paddingTop: 30,
    paddingBottom: 60,
  },
  logOutHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 17,
    backgroundColor: theme.colors.white,
    marginTop: 20,
    marginBottom: 10,
  },
  logOutText: {
    color: theme.colors.error,
  },
  delAccountOutText: {
    color: theme.colors.darkGrayishBlue,
  },
  logOutIcon: {
    marginEnd: 13.5,
  },
});
