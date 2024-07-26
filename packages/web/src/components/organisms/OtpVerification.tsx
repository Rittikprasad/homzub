import React, { useEffect, useState } from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import { useDispatch } from "react-redux";
import { NavigationService } from "@homzhub/web/src/services/NavigationService";
import { AlertHelper } from "@homzhub/common/src/utils/AlertHelper";
import { ObjectMapper } from "@homzhub/common/src/utils/ObjectMapper";
import { useOnly } from "@homzhub/common/src/utils/MediaQueryUtils";
import { AnalyticsService } from "@homzhub/common/src/services/Analytics/AnalyticsService";
import {
  PixelEventType,
  PixelService,
} from "@homzhub/web/src/services/PixelService";
import {
  IUserTokens,
  StorageKeys,
  StorageService,
} from "@homzhub/common/src/services/storage/StorageService";
import { UserService } from "@homzhub/common/src/services/UserService";
import { UserRepository } from "@homzhub/common/src/domain/repositories/UserRepository";
import { theme } from "@homzhub/common/src/styles/theme";
import { RouteNames } from "@homzhub/web/src/router/RouteNames";
import { UserActions } from "@homzhub/common/src/modules/user/actions";
import Icon, { icons } from "@homzhub/common/src/assets/icon";
import { Button } from "@homzhub/common/src/components/atoms/Button";
import { Typography } from "@homzhub/common/src/components/atoms/Typography";
import { OtpInputs } from "@homzhub/common/src/components/molecules/OTPInput/OtpInputs";
import { OtpTimer } from "@homzhub/common/src/components/atoms/OtpTimer";
import { GetToKnowUsCarousel } from "@homzhub/web/src/components/organisms/GetToKnowUsCarousel";
import UserValidationScreensTemplate from "@homzhub/web/src/components/hoc/UserValidationScreensTemplate";
import { User } from "@homzhub/common/src/domain/models/User";
import {
  IEmailLoginPayload,
  ILoginPayload,
  IOtpLoginPayload,
  ISignUpPayload,
  LoginTypes,
} from "@homzhub/common/src/domain/repositories/interfaces";
import { ISocialUserData } from "@homzhub/common/src/constants/SocialAuthProviders";
import { deviceBreakpoint } from "@homzhub/common/src/constants/DeviceBreakpoints";
import { EventType } from "@homzhub/common/src/services/Analytics/EventType";

export enum OtpNavTypes {
  Login = "Login",
  SignUp = "SignUp",
  SocialMedia = "SocialMedia",
  UpdateProfileByEmailPhoneOtp = "UpdateProfileByEmailPhoneOtp",
  UpdateProfileByOtp = "UpdateProfileByOtp",
}

interface IDispatchProps {
  login?: (payload: ILoginPayload) => void;
  loginSuccess?: (data: IUserTokens) => void;
}

interface IOtpProps {
  otpSentTo: string;
  phoneCode: string;
  type: OtpNavTypes;
  userData?: ISignUpPayload | undefined;
  onCallback?: (() => void) | undefined;
  socialUserData?: ISocialUserData | undefined;
  buttonTitle?: string;
  navigationPath?: string;
}

interface IProps extends RouteComponentProps {
  isAuthenticated: boolean;
}
type Props = IDispatchProps & IProps;

const OtpVerification: React.FC<Props> = (props: Props) => {
  const defaultOtpProps = {
    otpSentTo: "",
    phoneCode: "",
    type: OtpNavTypes.Login,
  };
  const dispatch = useDispatch();
  const [errorState, toggleErrorState] = useState(true);
  const [userOtp, setOtp] = useState("");
  const styles = mobileVerificationStyle();
  const { isAuthenticated, history } = props;
  const { location } = history;
  const { state } = location;
  const {
    phoneCode,
    otpSentTo,
    type,
    userData,
    socialUserData,
    buttonTitle,
    navigationPath,
  } = (state as IOtpProps) || defaultOtpProps;
  useEffect(() => {
    if (isAuthenticated) {
      NavigationService.navigate(history, {
        path: RouteNames.protectedRoutes.DASHBOARD,
      });
    } else {
      fetchOtp().then();
    }
  }, []);

  const handleOtpVerification = (otp: string): void => {
    setOtp(otp);
  };
  const toggleError = (): void => {
    if (errorState) {
      toggleErrorState(false);
    }
  };

  const verifyOtp = async (): Promise<void> => {
    if (type === OtpNavTypes.Login) {
      loginOtp(userOtp ?? "");
      return;
    }

    if (type === OtpNavTypes.SocialMedia) {
      await socialSignUp(userOtp);
    }
    try {
      await UserService.verifyOtp(userOtp, otpSentTo, phoneCode);
      if (type === OtpNavTypes.SignUp) {
        await signUp();
      }
    } catch (e) {
      toggleErrorState(true);
    }
  };

  const navigateToHomeScreen = (): void => {
    NavigationService.navigate(history, {
      path: RouteNames.protectedRoutes.DASHBOARD,
    });
  };

  const signUp = async (): Promise<void> => {
    if (!userData) {
      return;
    }
    try {
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
        is_referral: !!userData.signup_referral_code,
        callback: navigateToHomeScreen,
      };

      dispatch(UserActions.login(loginPayload));
    } catch (e) {
      AlertHelper.error({
        message: e.message,
        statusCode: e.details.statusCode,
      });
    }
  };

  const socialSignUp = async (otp: string): Promise<void> => {
    if (!socialUserData || !otpSentTo || !phoneCode) {
      return;
    }
    const trackData = {
      source: socialUserData.provider,
      email: socialUserData.user.email,
      phone_number: otpSentTo,
    };
    try {
      const data: User = await UserRepository.socialSignUp({
        provider: socialUserData.provider,
        id_token: socialUserData.idToken,
        otp,
        phone_code: phoneCode,
        phone_number: otpSentTo,
      });
      const tokens = {
        refresh_token: data.refreshToken,
        access_token: data.accessToken,
      };
      PixelService.ReactPixel.track(PixelEventType.CompleteRegistration);
      AnalyticsService.setUser(
        ObjectMapper.deserialize(User, socialUserData.user),
        () => {
          AnalyticsService.track(EventType.SignupSuccess, trackData);
        }
      );
      dispatch(UserActions.loginSuccess(tokens));
      navigateToHomeScreen();
      await StorageService.set<IUserTokens>(StorageKeys.USER, tokens);
    } catch (e) {
      AlertHelper.error({
        message: e.message,
        statusCode: e.details.statusCode,
      }); // TODOS: Lakshit - Require clarity on usage
      AnalyticsService.track(EventType.SignupFailure, {
        ...trackData,
        error: e.message,
      });
    }
  };

  const loginOtp = (otp: string): void => {
    const loginData: IOtpLoginPayload = {
      action: LoginTypes.OTP,
      payload: {
        phone_code: phoneCode,
        phone_number: otpSentTo,
        otp,
      },
    };
    const loginPayload: ILoginPayload = {
      data: loginData,
      callback: navigateToHomeScreen,
    };
    dispatch(UserActions.login(loginPayload));
  };

  const onIconPress = (): void => {
    if (navigationPath)
      NavigationService.navigate(history, { path: navigationPath });
    else history.goBack();
  };
  const { t } = useTranslation();
  const seconds = 5;
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const fetchOtp = async (): Promise<void> => {
    try {
      await UserService.fetchOtp(otpSentTo, phoneCode);
    } catch (e) {
      AlertHelper.error({
        message: e.message,
        statusCode: e.details.statusCode,
      });
    }
  };

  return (
    <View style={styles.container}>
      <UserValidationScreensTemplate
        title={t("auth:verifyNumber")}
        subTitle={t("auth:enterOtpWeb")}
        hasBackButton
        containerStyle={[
          styles.formContainer,
          isTablet && styles.formContainerTablet,
          isMobile && styles.formContainerMobile,
        ]}
        navigationPath={
          type === OtpNavTypes.Login
            ? RouteNames.publicRoutes.LOGIN
            : RouteNames.publicRoutes.SIGNUP
        }
      >
        <View
          style={
            isMobile
              ? styles.mobileVerificationContainerMobile
              : styles.mobileVerificationContainer
          }
        >
          <View style={styles.numberContainer}>
            <Typography variant="text" size="small" fontWeight="semiBold">
              {phoneCode} {otpSentTo}
            </Typography>
            <Icon
              name={icons.noteBook}
              size={18}
              color={theme.colors.active}
              onPress={onIconPress}
              style={styles.editIcon}
              testID="icnEdit"
            />
          </View>
          <View>
            <OtpInputs
              bubbleOtp={handleOtpVerification}
              toggleError={toggleError}
            />
          </View>
          <View style={styles.resendTextContainer}>
            <Typography
              variant="label"
              size="large"
              fontWeight="regular"
              style={styles.notReceiveOtpText}
            >
              {`${t("auth:receiveOtp")} `}
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
                  {t("auth:resend")}
                </Typography>
              )}
            </Typography>
          </View>
          <Button
            type="primary"
            title={buttonTitle || t("common:login")}
            containerStyle={[styles.signupButtonStyle]}
            onPress={verifyOtp}
          />
        </View>
      </UserValidationScreensTemplate>
      <GetToKnowUsCarousel />
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
}

const mobileVerificationStyle =
  (): StyleSheet.NamedStyles<IVerificationStyle> =>
    StyleSheet.create<IVerificationStyle>({
      container: {
        flexDirection: "row",
        width: "100vw",
        height: "100vh",
      },
      mobileVerificationContainer: {
        marginHorizontal: "auto",
        width: "55%",
      },
      mobileVerificationContainerMobile: {
        width: "90%",
        marginHorizontal: "auto",
      },
      formContainer: {
        width: "45vw",
        alignItems: "flex-start",
      },
      formContainerMobile: {
        width: "100vw",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: "20%",
      },
      formContainerTablet: {
        width: "100%",
        alignItems: undefined,
        paddingHorizontal: undefined,
        paddingTop: "20%",
      },
      carousalContainer: {
        width: "55vw",
        backgroundColor: theme.colors.grey1,
      },
      logo: {
        marginBottom: "4%",
      },
      verifyText: {
        marginTop: "2%",
      },
      otpText: {
        color: theme.colors.darkTint3,
      },
      numberContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: "2%",
      },
      editIcon: {
        marginLeft: "1%",
      },
      resendTextContainer: {
        flexDirection: "row",
        marginTop: "2%",
      },
      notReceiveOtpText: {
        color: theme.colors.darkTint4,
      },
      resendText: {
        color: theme.colors.active,
      },
      signupButtonStyle: {
        marginTop: "7%",
      },
    });
export default OtpVerification;
