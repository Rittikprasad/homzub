/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import EmergencyContactForm from '@homzhub/common/src/components/molecules/EmergencyContactForm';
import { IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import PhoneCodePrefix from '@homzhub/web/src/components/molecules/PhoneCodePrefix';
import WorkInfoForm from '@homzhub/common/src/components/molecules/WorkInfoForm';
import { ProfileUserFormTypes } from '@homzhub/web/src/screens/profile/components/ProfilePopover';
import ChangePassword from '@homzhub/web/src/screens/profile/components/ChangePassword';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface ICompProps {
  formType: ProfileUserFormTypes;
  handlePopupClose: () => void;
}

interface IStateProps {
  userProfile?: UserProfileModel;
}
interface IDispatchProps {
  getUserProfile: () => void;
}

type Props = WithTranslation & IStateProps & ICompProps & IDispatchProps;

interface IOwnState {
  isFormLoading: boolean;
}

export class ProfileModalContent extends React.PureComponent<Props, IOwnState> {
  public state = {
    isFormLoading: false,
  };

  public render = (): React.ReactNode => {
    const { isFormLoading } = this.state;

    if (isFormLoading) {
      return <Loader visible={isFormLoading} />;
    }

    return <View style={styles.container}>{this.renderFormOnType()}</View>;
  };

  private renderFormOnType = (): React.ReactNode => {
    const { userProfile, formType, handlePopupClose } = this.props;
    if (!userProfile) {
      return null;
    }
    const { emergencyContact, workInfo } = userProfile;
    const handleWebView = (params: IWebProps): React.ReactElement => {
      return <PhoneCodePrefix {...params} />;
    };
    switch (formType || ProfileUserFormTypes.BasicDetails) {
      case ProfileUserFormTypes.EmergencyContact:
        return (
          <EmergencyContactForm
            onFormSubmitSuccess={this.onFormSubmissionSuccess}
            formData={{
              name: emergencyContact.name,
              email: emergencyContact.email,
              phone: emergencyContact.phoneNumber,
              phoneCode: emergencyContact.phoneCode,
            }}
            basicDetails={{ email: userProfile.email, phone: userProfile.phoneNumber }}
            updateFormLoadingState={this.changeLoadingStatus}
            handlePopupClose={handlePopupClose}
            webGroupPrefix={handleWebView}
          />
        );
      case ProfileUserFormTypes.WorkInfo:
        return (
          <WorkInfoForm
            onFormSubmitSuccess={this.onFormSubmissionSuccess}
            formData={{
              name: workInfo ? workInfo.companyName : '',
              email: workInfo && workInfo.workEmail ? workInfo.workEmail : '',
            }}
            updateFormLoadingState={this.changeLoadingStatus}
            handlePopupClose={handlePopupClose}
          />
        );
      case ProfileUserFormTypes.ChangePassword:
        return <ChangePassword handlePopupClose={handlePopupClose} />;
      default:
        return <View />;
    }
  };

  private onFormSubmissionSuccess = (): void => {
    const { getUserProfile } = this.props;
    getUserProfile();
    // Navigation Logic
  };

  private changeLoadingStatus = (isFormLoading: boolean): void => {
    this.setState({ isFormLoading });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserProfile } = UserSelector;
  return {
    userProfile: getUserProfile(state),
  };
};
export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getUserProfile } = UserActions;
  return bindActionCreators({ getUserProfile }, dispatch);
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.moreProfile)(ProfileModalContent));
