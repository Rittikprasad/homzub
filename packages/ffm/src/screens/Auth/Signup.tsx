import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import Call from '@homzhub/common/src/assets/images/call.svg';
import Mail from '@homzhub/common/src/assets/images/mail.svg';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import SignUpForm from '@homzhub/ffm/src/components/organisms/SignupForm';
import { User } from '@homzhub/common/src/domain/models/User';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
import { OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { Role } from '@homzhub/common/src/constants/Signup';

const Signup = (): React.ReactElement => {
  const { goBack, navigate } = useNavigation();
  const { t } = useTranslation();
  const selectedRole = useSelector(FFMSelector.getSelectedRole);
  const [isSupportVisible, setSupportVisibility] = useState(false);
  const [supportDetail, setSupportDetail] = useState<User>(new User());

  useFocusEffect(
    useCallback(() => {
      CommonRepository.getSupportContacts()
        .then((res) => setSupportDetail(res))
        .catch((e) => {
          AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
        });
    }, [])
  );

  const onBack = (): void => {
    goBack();
  };

  const onTermsofUse = (): void => {
    navigate(ScreensKeys.WebViewScreen, { url: 'https://www.homzhub.com/terms&Condition' });
  };

  const onPrivacy = (): void => {
    navigate(ScreenKeys.WebViewScreen, { url: 'https://www.homzhub.com/privacyPolicy' });
  };

  const onSubmit = async (userData: ISignUpPayload): Promise<void> => {
    try {
      console.log('🚀 ~ file: Signup.tsx ~ line 78 ~ onSubmit ~ userData', userData);
      const response = await UserRepository.emailExists(userData.email);
      if (response.is_exists) {
        AlertHelper.error({ message: t('auth:emailAlreadyExists') });
        return;
      }

      const phone = `${userData.phone_code}~${userData.phone_number}`;
      const isPhoneUsed = await UserRepository.phoneExists(phone);
      if (isPhoneUsed.is_exists) {
        AlertHelper.error({ message: t('auth:phoneAlreadyExists') });
        console.log("🚀 ~ file: Signup.tsx ~ line 69 ~ onSubmit ~ ({ message: t('auth:phoneAlreadyExists') })", {
          message: t('auth:phoneAlreadyExists'),
        });
        return;
      }

      navigate(ScreenKeys.WorkLocations, {
        type: OtpNavTypes.SignUp,
        title: t('auth:verifyMobile'),
        countryCode: userData.phone_code,
        otpSentTo: userData.phone_number,
        userData,
      });
    } catch (e) {
      console.log('🚀 ~ file: Signup.tsx ~ line 80 ~ onSubmit ~ e', e);
      AlertHelper.error({ message: t('auth:phoneAlreadyExists') });
    }
  };

  const handleCalling = async (): Promise<void> => {
    await LinkingService.openDialer(`${supportDetail.countryCode}${supportDetail.phoneNumber}`);
  };

  const handleMail = async (): Promise<void> => {
    await LinkingService.openEmail({ email: supportDetail.email });
  };

  const getTitle = (): string => {
    if (selectedRole) {
      if (selectedRole.code === Role.PROPERTY_MANAGER) {
        return t('auth:signUpWith', { name: 'Manager' });
      }
      if (selectedRole.code === Role.PROPERTY_AGENT) {
        return t('auth:signUpWith', { name: 'Agent' });
      }
      return t('auth:signUpWith', { name: selectedRole.name });
    }
    return t('common:signUp');
  };

  return (
    <GradientScreen screenTitle={getTitle()} isScrollable>
      <>
        <View style={styles.header}>
          <TouchableOpacity style={styles.helpContainer} onPress={goBack}>
            <Icon name={icons.close} size={20} color={theme.colors.darkTint3} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpContainer} onPress={(): void => setSupportVisibility(true)}>
            <Icon name={icons.supportTicket} size={16} color={theme.colors.primaryColor} />
            <Label type="large" style={styles.helpText}>
              {t('common:helpAndSupport')}
            </Label>
          </TouchableOpacity>
        </View>

        <SignUpForm onSubmit={onSubmit} onBack={onBack} onPressLink={onTermsofUse} onPressPrivacyLink={onPrivacy} />
        <BottomSheet visible={isSupportVisible} onCloseSheet={(): void => setSupportVisibility(false)}>
          <View style={styles.sheetContent}>
            <TouchableOpacity style={styles.sheetText} onPress={handleCalling}>
              <Call style={styles.icon} />
              <Label type="large" style={styles.label}>
                {`(${supportDetail.countryCode}) ${supportDetail.phoneNumber}`}
              </Label>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sheetText, styles.mail]} onPress={handleMail}>
              <Mail style={styles.icon} />
              <Label type="large" style={styles.label}>
                {supportDetail.email}
              </Label>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </>
    </GradientScreen>
  );
};

export default Signup;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpText: {
    textAlign: 'right',
    color: theme.colors.darkTint2,
    marginHorizontal: 6,
  },
  sheetContent: {
    marginHorizontal: 16,
  },
  sheetText: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  mail: {
    marginVertical: 20,
  },
  icon: {
    marginHorizontal: 10,
  },
  label: {
    color: theme.colors.darkTint3,
  },
});
