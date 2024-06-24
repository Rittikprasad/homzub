/* eslint-disable react/jsx-no-undef */
import React, { FC, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useOnly, useDown, useIsIpadPro } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import PhoneCodePrefix from '@homzhub/web/src/components/molecules/PhoneCodePrefix';
import { GetToKnowUsCarousel } from '@homzhub/web/src/components/organisms/GetToKnowUsCarousel';
import { SignUpForm } from '@homzhub/common/src/components/organisms/SignUpForm';
import { SocialMediaGateway } from '@homzhub/web/src/components/organisms/SocialMediaGateway';
import UserValidationScreensTemplate from '@homzhub/web/src/components/hoc/UserValidationScreensTemplate';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { OtpNavTypes } from '@homzhub/web/src/components/organisms/OtpVerification';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IOwnProps extends RouteComponentProps {
  isAuthenticated: boolean;
}

type IProps = IOwnProps;

const SignUp: FC<IProps> = (props: IProps) => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.auth);
  const { history, isAuthenticated } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated) {
      NavigationService.navigate(history, {
        path: RouteNames.protectedRoutes.DASHBOARD,
      });
    }
  }, []);
  useEffect(() => {
    dispatch(CommonActions.getCountries());
    dispatch(CommonActions.setDeviceCountry('IN'));
  }, []);
  const commonLoaders = useSelector(CommonSelectors.getCommonLoaders);
  const { whileGetCountries } = commonLoaders;
  const onFormSubmit = async (formData: ISignUpPayload): Promise<void> => {
    try {
      const isEmailUsed = await UserRepository.emailExists(formData.email);
      if (isEmailUsed.is_exists) {
        AlertHelper.error({ message: t('auth:emailAlreadyExists') }); // TODOS: Lakshit - Require clarity on usage
        return;
      }

      const phone = `${formData.phone_code}~${formData.phone_number}`;
      const isPhoneUsed = await UserRepository.phoneExists(phone);
      if (isPhoneUsed.is_exists) {
        AlertHelper.error({ message: t('auth:phoneAlreadyExists') }); // TODOS: Lakshit - Require clarity on usage
        return;
      }

      if (formData.signup_referral_code) {
        const isValidCode = await UserRepository.verifyReferalCode(formData.signup_referral_code);
        if (!isValidCode.is_applicable) {
          AlertHelper.error({ message: t('auth:invalidReferralCodeError') }); // TODOS: Lakshit - Require clarity on usage
          return;
        }
      }
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_code: formData.phone_code,
        phone_number: formData.phone_number,
        password: formData.password,
        signup_referral_code: formData.signup_referral_code,
      };
      const compProps = {
        phoneCode: formData.phone_code,
        otpSentTo: formData.phone_number,
        type: OtpNavTypes.SignUp,
        userData,
        buttonTitle: t('auth:signup'),
        navigationPath: RouteNames.publicRoutes.SIGNUP,
      };
      NavigationService.navigate(props.history, {
        path: RouteNames.publicRoutes.OTP_VERIFICATION,
        params: { ...compProps },
      });
      // TODO: ONCE THE DATA IS VALIDATED NAVIGATE TO OTP SCREEN
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details), statusCode: err.details.statusCode });
    }
  };

  const handleTermsCondition = (): void => {
    NavigationService.navigate(props.history, { path: RouteNames.publicRoutes.TERMS_CONDITION });
  };

  const handleWebView = (params: IWebProps): React.ReactElement => {
    return <PhoneCodePrefix {...params} />;
  };
  const navigateToScreen = (): void => {
    NavigationService.navigate(history, { path: RouteNames.publicRoutes.LOGIN });
  };
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const isIPadPro = useIsIpadPro();
  const styles = signUpStyles(isMobile);
  if (whileGetCountries) {
    return <Loader visible={whileGetCountries} />;
  }
  return (
    <View style={[styles.container, isTablet && styles.tabletContainer, isIPadPro && styles.iPadContainer]}>
      <UserValidationScreensTemplate
        hasBackButton={false}
        containerStyle={[styles.containerStyle, isTablet && styles.containerStyleTablet]}
        title={t('common:signUp')}
        subTitle={t('common:createAccount')}
      >
        <View style={[styles.formContainer, isMobile && styles.formContainerMobile]}>
          <SignUpForm
            onSubmitFormSuccess={onFormSubmit}
            onPressLink={handleTermsCondition}
            referralCode=""
            testID="signupForm"
            webGroupPrefix={handleWebView}
          />
        </View>
        <View style={styles.existingUser}>
          <Typography variant="label" size="large">
            {t('auth:alreadyAccount')}
          </Typography>
          <TouchableOpacity onPress={navigateToScreen}>
            <Typography variant="label" size="large" fontWeight="semiBold" style={styles.alreadyAccount}>
              {t('auth:loginInstead')}
            </Typography>
          </TouchableOpacity>
        </View>
        <SocialMediaGateway isFromLogin={false} containerStyle={styles.socialMediaContainer} history={history} />
      </UserValidationScreensTemplate>
      <GetToKnowUsCarousel />
    </View>
  );
};
interface ISignUpStyles {
  container: ViewStyle;
  containerStyle: ViewStyle;
  containerStyleTablet: ViewStyle;
  tabletContainer: ViewStyle;
  submitStyle: ViewStyle;
  formContainer: ViewStyle;
  formContainerMobile: ViewStyle;
  iPadContainer: ViewStyle;
  socialMediaContainer: ViewStyle;
  existingUser: ViewStyle;
  alreadyAccount: ViewStyle;
}
const signUpStyles = (isMobile: boolean): StyleSheet.NamedStyles<ISignUpStyles> =>
  StyleSheet.create<ISignUpStyles>({
    container: {
      flex: 1,
      flexDirection: 'row',
      minHeight: '150vh',
    },
    tabletContainer: {
      minHeight: '100vh',
    },
    containerStyle: {
      backgroundColor: theme.colors.white,
      width: '45%',
    },
    containerStyleTablet: {
      width: '100%',
    },
    submitStyle: {
      flex: 0,
      marginTop: 30,
    },
    formContainer: {
      width: '55%',
      marginHorizontal: 'auto',
    },
    formContainerMobile: {
      width: '90%',
    },
    iPadContainer: {
      minHeight: '100vh',
    },
    socialMediaContainer: {
      marginTop: 36,
      alignSelf: 'center',
      width: isMobile ? '100%' : '50%',
    },
    existingUser: {
      flexDirection: 'row',
      justifyContent: 'center',
      top: 30,
    },
    alreadyAccount: {
      color: theme.colors.primaryColor,
    },
  });

export default SignUp;
