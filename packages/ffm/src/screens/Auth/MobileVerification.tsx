import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserService } from '@homzhub/common/src/services/UserService';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { OtpTimer } from '@homzhub/common/src/components/atoms/OtpTimer';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import { OtpInputs, OtpTypes } from '@homzhub/common/src/components/molecules/OtpInputs';
import {
  IEmailLoginPayload,
  ILoginPayload,
  IOtpLoginPayload,
  LoginTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
import { IOtpNavProps, OtpNavTypes } from '@homzhub/mobile/src/navigation/interfaces';

const MobileVerification = (): React.ReactElement => {
  const { goBack, navigate } = useNavigation();
  const { params } = useRoute();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const { type, userData, title, otpSentTo, countryCode } = params as IOtpNavProps;

  useEffect(() => {
    fetchOtp().then();
  }, []);

  const fetchOtp = async (): Promise<void> => {
    try {
      if (StringUtils.isValidEmail(otpSentTo)) {
        await UserService.fetchEmailOtp(otpSentTo);
        return;
      }

      await UserService.fetchOtp(otpSentTo, countryCode);
    }catch (e: any) {      AlertHelper.error({
        message: ErrorUtils.getErrorMessage(e.details),
      });
    }
  };
  const handleOtpVerification = async (otp: string): Promise<void> => {
    if (type === OtpNavTypes.Login) {
      loginOtp(otp);
      return;
    }
    try {
      await UserService.verifyOtp(otp, otpSentTo, countryCode);
      if (type === OtpNavTypes.SignUp) {
        await signUp();
      }
    }catch (e: any) {      setError(true);
    }
  };
  const loginOtp = (otp: string): void => {
    const loginData: IOtpLoginPayload = {
      action: LoginTypes.OTP,
      payload: {
        phone_code: countryCode,
        phone_number: otpSentTo,
        otp,
      },
    };

    const loginPayload: ILoginPayload = {
      data: loginData,
    };
    dispatch(UserActions.login(loginPayload));
  };

  const signUp = async (): Promise<void> => {
    try {
      if (userData) {
        console.log('🚀 ~ file: MobileVerification.tsx ~ line 87 ~ signUp ~ userData', userData);
        await UserRepository.signUp(userData);
        const loginData: IEmailLoginPayload = {
          action: LoginTypes.EMAIL,
          payload: {
            email: userData.email,
            password: userData.password,
          },
        };
        const loginPayload: ILoginPayload = {
          data: loginData,
          is_from_signup: true,
          callback: handleCallback,
        };
        dispatch(UserActions.login(loginPayload));
      }
    }catch (e: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  const handleBack = (): void => {
    if ([OtpNavTypes.UpdateProfileByOtp, OtpNavTypes.UpdateProfileByEmailPhoneOtp].includes(type)) {
      navigate(ScreenKeys.UserProfile);
    } else {
      goBack();
    }
  };

  const handleCallback = (): void => {
    dispatch(FFMActions.setWorkLocations([]));
  };

  const onEdit = (): void => {
    if (type === OtpNavTypes.Login) {
      goBack();
    } else {
      navigate(ScreenKeys.Signup);
    }
  };

  return (
    <GradientScreen onGoBack={handleBack}>
      <Text type="large" textType="semiBold" style={styles.title}>
        {title}
      </Text>
      <Label type="large" style={styles.subHeading}>
        {t('auth:enterOtpWeb')}
      </Label>
      <>
        <View style={styles.numberContainer}>
          <Text type="small" textType="semiBold">
            {`${countryCode} ${otpSentTo}`}
          </Text>
          <Icon
            name={icons.noteBook}
            size={16}
            color={theme.colors.active}
            style={styles.icon}
            onPress={onEdit}
            testID="icnEdit"
          />
        </View>
        <OtpInputs
          error={error ? t('auth:otpError') : undefined}
          bubbleOtp={handleOtpVerification}
          toggleError={(): void => setError(false)}
          otpType={OtpTypes.PhoneOrEmail}
        />
        <OtpTimer onResentPress={fetchOtp} />
      </>
    </GradientScreen>
  );
};

export default MobileVerification;

const styles = StyleSheet.create({
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginStart: 8,
  },
  title: {
    color: theme.colors.darkTint1,
  },
  subHeading: {
    color: theme.colors.darkTint3,
    marginVertical: 8,
  },
});
