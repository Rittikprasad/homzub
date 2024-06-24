import React, { useState } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { UserService } from '@homzhub/common/src/services/UserService';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { OtpTimer } from '@homzhub/common/src/components/atoms/OtpTimer';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { OtpInputs } from '@homzhub/common/src/components/molecules/OtpInputs';
import { IUserProfileForm } from '@homzhub/mobile/src/components/molecules/UserProfileForm';
import { OtpNavTypes } from '@homzhub/web/src/components/organisms/OtpVerification';
import { ISignUpPayload, IUpdateProfileResponse } from '@homzhub/common/src/domain/repositories/interfaces';
import { ISocialUserData } from '@homzhub/common/src/constants/SocialAuthProviders';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IOtpProps {
  otpSentTo: string;
  phoneCode: string;
  type?: OtpNavTypes;
  userData?: ISignUpPayload | undefined;
  onCallback?: (() => void) | undefined;
  socialUserData?: ISocialUserData | undefined;
  buttonTitle?: string;
  navigationPath?: string;
  updatePopUp: (data: string) => void;
  updateProfileCallback: (phoneOrEmailOtp: string, emailOTP?: string) => Promise<void>;
  responseFromPassword: IUpdateProfileResponse;
  profileForm: IUserProfileForm;
}

type Props = IOtpProps;

const OtpVerification: React.FC<Props> = (props: Props) => {
  const defaultOtpProps = {
    otpSentTo: '',
    phoneCode: '',
    type: OtpNavTypes.Login,
  };
  const [errorState, toggleErrorState] = useState(true);
  const [userOtp, setOtp] = useState('');
  const [prevOtp, setPrevOtp] = useState('');
  const styles = mobileVerificationStyle();
  const [isEmailOtp, setIsEmailOtp] = useState(false);
  const { phoneCode, otpSentTo, type, buttonTitle, responseFromPassword, profileForm } = props || defaultOtpProps;
  const { new_phone, new_email } = responseFromPassword;

  const handleOtpVerification = (otp: string): void => {
    setOtp(otp);
  };

  const toggleError = (): void => {
    if (errorState) {
      toggleErrorState(false);
    }
  };

  const verifyOtp = (): void => {
    const { updateProfileCallback } = props;
    if (type === OtpNavTypes.UpdateProfileByEmailPhoneOtp) {
      if (isEmailOtp) {
        if (new_phone) {
          updateProfileCallback(userOtp, prevOtp);
        } else {
          updateProfileCallback(prevOtp, userOtp);
        }
      } else {
        setPrevOtp(userOtp);
        handleOtpVerification('');
        setIsEmailOtp(true);
      }
    } else {
      updateProfileCallback(userOtp);
    }
  };

  const { t } = useTranslation();
  const seconds = 5;
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const fetchOtp = async (): Promise<void> => {
    try {
      await UserService.fetchOtp(otpSentTo, phoneCode);
    } catch (e) {
      AlertHelper.error({
        message: e.message,
      });
    }
  };

  const renderTitleContent = (): string => {
    let title = '';
    if (type !== OtpNavTypes.UpdateProfileByEmailPhoneOtp) {
      if (!new_email) {
        title = `${profileForm.phoneCode}  ${profileForm.phone}`;
      } else {
        title = profileForm.email;
      }
    } else if (new_phone) {
      title = profileForm.email;
      if (isEmailOtp) {
        title = `${profileForm.phoneCode} ${profileForm.phone}`;
      }
    } else {
      title = `${profileForm.phoneCode} ${profileForm.phone}`;
      if (isEmailOtp) {
        title = profileForm.email;
      }
    }
    return title;
  };

  return (
    <View style={styles.container}>
      <View style={isMobile ? styles.mobileVerificationContainerMobile : styles.mobileVerificationContainer}>
        <View style={styles.otpHeader}>
          <Typography variant="text" size="large" fontWeight="semiBold">
            {t('moreProfile:otpVerificationText')}
          </Typography>
          <Typography variant="label" size="regular" style={styles.topPadding}>
            {t('auth:enterOtpWeb')}
          </Typography>
        </View>
        <View style={styles.numberContainer}>
          <Typography variant="text" size="small" fontWeight="semiBold">
            {renderTitleContent()}
          </Typography>
        </View>
        <View style={[styles.otpInputMobile, new_email && styles.otpInputEmail]}>
          <OtpInputs bubbleOtp={handleOtpVerification} toggleError={toggleError} shouldClear={isEmailOtp} />
        </View>
        <View style={styles.resendTextContainer}>
          <Typography variant="label" size="large" fontWeight="regular" style={styles.notReceiveOtpText}>
            {`${t('auth:receiveOtp')} `}
            {seconds > 0 ? (
              <OtpTimer onResentPress={fetchOtp} />
            ) : (
              <Typography
                variant="label"
                size="large"
                fontWeight="semiBold"
                style={styles.resendText}
                onPress={fetchOtp}
              >
                {t('auth:resend')}
              </Typography>
            )}
          </Typography>
        </View>
        <Button
          type="primary"
          title={buttonTitle || t('common:continue')}
          containerStyle={[styles.signupButtonStyle]}
          disabled={userOtp.length < 6}
          onPress={verifyOtp}
        />
      </View>
    </View>
  );
};

interface IVerificationStyle {
  container: ViewStyle;
  formContainer: ViewStyle;
  carousalContainer: ViewStyle;
  logo: ViewStyle;
  verifyText: TextStyle;
  otpText: TextStyle;
  numberContainer: ViewStyle;
  editIcon: ViewStyle;
  resendTextContainer: ViewStyle;
  notReceiveOtpText: TextStyle;
  resendText: TextStyle;
  signupButtonStyle: ViewStyle;
  formContainerMobile: ViewStyle;
  formContainerTablet: ViewStyle;
  mobileVerificationContainer: ViewStyle;
  mobileVerificationContainerMobile: ViewStyle;
  otpInputMobile: ViewStyle;
  otpInputEmail: ViewStyle;
  topPadding: ViewStyle;
  otpHeader: ViewStyle;
}

const mobileVerificationStyle = (): StyleSheet.NamedStyles<IVerificationStyle> =>
  StyleSheet.create<IVerificationStyle>({
    container: {
      flexDirection: 'row',
      width: '100%',
      height: 'max-content',
      maxHeight: 340,
    },
    mobileVerificationContainer: {
      marginHorizontal: 'auto',
      width: '55%',
    },
    mobileVerificationContainerMobile: {
      width: '60%',
      marginHorizontal: 'auto',
    },
    formContainer: {
      width: '45vw',
      alignItems: 'flex-start',
    },
    formContainerMobile: {
      width: '100vw',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: '20%',
    },
    formContainerTablet: {
      width: '100%',
      alignItems: undefined,
      paddingHorizontal: undefined,
      paddingTop: '20%',
    },
    carousalContainer: {
      width: '55vw',
      backgroundColor: theme.colors.grey1,
    },
    logo: {
      marginBottom: '4%',
    },
    verifyText: {
      marginTop: '2%',
    },
    otpText: {
      color: theme.colors.darkTint3,
    },
    numberContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 24,
      paddingTop: 8,
      marginTop: '2%',
    },
    editIcon: {
      marginLeft: '1%',
    },
    resendTextContainer: {
      width: '100%',
      flexDirection: 'row',
      marginTop: '2%',
    },
    notReceiveOtpText: {
      color: theme.colors.darkTint4,
    },
    resendText: {
      color: theme.colors.active,
    },
    signupButtonStyle: {
      marginTop: '7%',
    },
    otpInputMobile: {
      width: '150%',
      position: 'relative',
      left: '-25%',
    },
    otpInputEmail: {
      left: '-25%',
    },
    topPadding: {
      paddingTop: 8,
    },
    otpHeader: {
      paddingTop: '10%',
      alignItems: 'center',
    },
  });
export default OtpVerification;
