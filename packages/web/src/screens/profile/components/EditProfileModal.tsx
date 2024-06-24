import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import EditProfileForm, { IUserProfileForm } from '@homzhub/web/src/components/molecules/EditProfileForm';
import { IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import PhoneCodePrefix from '@homzhub/web/src/components/molecules/PhoneCodePrefix';
import PasswordVerificationForm from '@homzhub/mobile/src/components/molecules/PasswordVerificationForm';
import OtpForm from '@homzhub/web/src/screens/profile/components/OtpForm';
import { OtpNavTypes } from '@homzhub/web/src/components/organisms/OtpVerification';
import { UserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import {
  IUpdateProfile,
  IUpdateProfileResponse,
  UpdateProfileTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  onFormSubmitSuccess?: (
    profileDetails: IUserProfileForm,
    profileUpdateResponse?: IUpdateProfileResponse,
    isAddressRequired?: boolean
  ) => void;
  userProfileInfo: UserProfile;
  renderPopup: string;
  updatePopUp: (data: string) => void;
  openEditModal: (status: boolean) => void;
  updateUserProfile: () => void;
}
interface IFormData {
  password: string;
}

type Props = IProps;

const EditProfileModal: React.FC<Props> = (props: Props) => {
  const { userProfileInfo, renderPopup, updatePopUp, openEditModal, updateUserProfile } = props;
  const popupRef = useRef<PopupActions>(null);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const [userProfileForm, setUserProfileForm] = useState({} as IUserProfileForm);
  const [responseFromPassword, setResponseFromPassword] = useState({} as IUpdateProfileResponse);
  const { t } = useTranslation();

  const updateUserForm = (data: IUserProfileForm): void => {
    setUserProfileForm(data);
  };

  const setResponseData = (data: IUpdateProfileResponse): void => {
    setResponseFromPassword(data);
  };

  const handlePopupClose = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
    openEditModal(false);
    updateUserProfile();
    updatePopUp('');
  };

  useEffect(() => {
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  }, []);

  const handleWebView = (params: IWebProps): React.ReactElement => {
    return <PhoneCodePrefix {...params} />;
  };

  const renderScene = (data: string): React.ReactElement => {
    switch (data) {
      case 'password':
        return renderPassword();
      case 'otpWithEmail':
        return renderOTPModal();
      case 'otpWithPhone':
        return renderOTPModal();
      default:
        return renderEditModal();
    }
  };

  const renderEditModal = (): React.ReactElement => {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography size="small" fontWeight="regular" style={styles.text}>
            {t('moreProfile:editProfile')}
          </Typography>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint3}
            onPress={handlePopupClose}
            containerStyle={styles.closeButton}
          />
        </View>
        <EditProfileForm
          userData={userProfileInfo}
          updateFormLoadingState={FunctionUtils.noop}
          webGroupPrefix={handleWebView}
          isTab={isTablet}
          isMobile={isMobile}
          updatePopUp={updatePopUp}
          updateUserProfile={updateUserForm}
          updateProfileWithoutPassword={setResponseData}
          closePopUp={handlePopupClose}
        />
      </View>
    );
  };

  const renderOTPModal = (): React.ReactElement => {
    const { new_phone, new_email, phone_otp, email_otp } = responseFromPassword;
    const {
      firstName,
      lastName,
      phoneCode,
      phone,
      email,
      address,
      cityName,
      country,
      stateName,
      countryIsoCode,
      postalCode,
    } = userProfileForm;

    const userAddress = {
      address,
      postal_code: postalCode,
      city_name: cityName,
      state_name: stateName,
      country_name: country,
      country_iso2_code: countryIsoCode,
    };
    const { email_otp: emailOtp1, phone_otp: phoneOtp } = responseFromPassword;
    const otpType = emailOtp1 && phoneOtp ? OtpNavTypes.UpdateProfileByEmailPhoneOtp : OtpNavTypes.UpdateProfileByOtp;

    const updateProfileDetails = async (
      phoneOrEmailOtp: string,
      emailOtp?: string,
      isAddressRequired?: boolean
    ): Promise<void> => {
      const payload: IUpdateProfile = {
        action: UpdateProfileTypes.UPDATE_BY_OTP,
        payload: {
          ...(new_phone && { new_phone }),
          ...(new_email && { new_email }),
          ...(phone_otp && { phone_otp: phoneOrEmailOtp }),
          ...(email_otp && { email_otp: emailOtp || phoneOrEmailOtp }),
          profile_details: {
            first_name: firstName,
            last_name: lastName,
            phone_code: phoneCode,
            phone_number: phone,
            email,
            user_address: isAddressRequired ? userAddress : null,
          },
        },
      };

      try {
        await UserRepository.updateUserProfileByActions(payload);
        handlePopupClose();
        updateUserProfile();
      } catch (e) {
        AlertHelper.error({ message: e.message });
      }
    };
    return (
      <View style={styles.container}>
        <View style={styles.buttonHeader}>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint3}
            onPress={handlePopupClose}
          />
        </View>
        <OtpForm
          otpSentTo={!new_email ? phone : email}
          phoneCode={!new_email ? phoneCode : ' '}
          responseFromPassword={responseFromPassword}
          profileForm={userProfileForm}
          updatePopUp={updatePopUp}
          type={otpType}
          updateProfileCallback={
            (phoneOrEmailOtp: string, emailOTP?: string): Promise<void> =>
              updateProfileDetails(phoneOrEmailOtp, emailOTP, true)
            // @ts-ignore
          }
        />
      </View>
    );
  };

  const renderPassword = (): React.ReactElement => {
    const onPasswordSubmit = async (password: string): Promise<void> => {
      const {
        firstName,
        lastName,
        email,
        phone,
        phoneCode,
        address,
        postalCode,
        cityName,
        stateName,
        country,
        countryIsoCode,
      } = userProfileForm;
      const userAddress = {
        address,
        postal_code: postalCode,
        city_name: cityName,
        state_name: stateName,
        country_name: country,
        country_iso2_code: countryIsoCode,
      };
      const profileDetails = {
        first_name: firstName,
        last_name: lastName,
        phone_code: phoneCode,
        phone_number: phone,
        email,
        user_address: userAddress,
      };
      const payload: IUpdateProfile = {
        action: UpdateProfileTypes.GET_OTP_OR_UPDATE,
        payload: {
          ...(password && { password }),
          profile_details: profileDetails,
        },
      };
      try {
        const response = await UserRepository.updateUserProfileByActions(payload);
        setResponseFromPassword(response);
        updatePopUp('otpWithEmail');
      } catch (e) {
        AlertHelper.error({ message: e.message });
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.buttonHeader}>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint3}
            onPress={handlePopupClose}
          />
        </View>
        <View style={styles.passwordConatiner}>
          <Typography variant="text" size="large" fontWeight="semiBold">
            {t('moreProfile:passwordVerificationText')}
          </Typography>
          <Typography variant="label" size="regular" style={styles.topPadding}>
            {t('moreProfile:enterYourPasswordText')}
          </Typography>
        </View>
        <View style={styles.passwordBox}>
          <PasswordVerificationForm onFormSubmit={onPasswordSubmit} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Popover
        forwardedRef={popupRef}
        content={renderScene(renderPopup)}
        popupProps={{
          position: 'right center',
          on: [],
          arrow: false,
          closeOnDocumentClick: false,
          children: undefined,
          modal: true,
          contentStyle: {
            width: renderPopup === '' ? (!isMobile ? 400 : '94%') : isMobile ? '90%' : 450,
            height: 'fit-content',
            maxHeight: '90%',
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 42,
  },
  text: {
    paddingTop: 12,
    paddingBottom: 24,
    textAlign: 'center',
  },
  container: {
    backgroundColor: theme.colors.white,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    paddingLeft: 18,
  },
  buttonHeader: {
    flexDirection: 'row-reverse',
    paddingRight: 24,
    paddingTop: 24,
  },
  button: {
    width: '100%',
    height: 44,
    top: 60,
  },
  image: {
    height: 120,
    width: 120,
  },
  passwordConatiner: {
    paddingTop: '15%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 24,
    top: 12,
    cursor: 'pointer',
  },
  passwordBox: {
    width: '90%',
    margin: 'auto',
    paddingTop: 18,
  },
  topPadding: {
    paddingTop: 8,
  },
});
export default EditProfileModal;
