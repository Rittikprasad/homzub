import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { withTranslation, WithTranslation } from "react-i18next";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { AlertHelper } from "@homzhub/common/src/utils/AlertHelper";
import { StringUtils } from "@homzhub/common/src/utils/StringUtils";
import { ObjectMapper } from "@homzhub/common/src/utils/ObjectMapper";
import { UserRepository } from "@homzhub/common/src/domain/repositories/UserRepository";
import {
  IUserTokens,
  StorageKeys,
  StorageService,
} from "@homzhub/common/src/services/storage/StorageService";
import { AnalyticsService } from "@homzhub/common/src/services/Analytics/AnalyticsService";
import { IRedirectionDetails } from "@homzhub/mobile/src/services/LinkingService";
import { NavigationService } from "@homzhub/mobile/src/services/NavigationService";
import { UserService } from "@homzhub/common/src/services/UserService";
import { CommonSelectors } from "@homzhub/common/src/modules/common/selectors";
import { theme } from "@homzhub/common/src/styles/theme";
import Icon, { icons } from "@homzhub/common/src/assets/icon";
import { UserActions } from "@homzhub/common/src/modules/user/actions";
import { UserSelector } from "@homzhub/common/src/modules/user/selectors";
import { Text } from "@homzhub/common/src/components/atoms/Text";
import { OtpTimer } from "@homzhub/common/src/components/atoms/OtpTimer";
import {
  OtpInputs,
  OtpTypes,
} from "@homzhub/common/src/components/molecules/OtpInputs";
import { Screen } from "@homzhub/mobile/src/components/HOC/Screen";
import { User } from "@homzhub/common/src/domain/models/User";
import { AuthStackParamList } from "@homzhub/mobile/src/navigation/AuthStack";
import { IState } from "@homzhub/common/src/modules/interfaces";
import {
  NavigationScreenProps,
  OtpNavTypes,
  ScreensKeys,
} from "@homzhub/mobile/src/navigation/interfaces";
import {
  IEmailLoginPayload,
  ILoginPayload,
  IOtpLoginPayload,
  LoginTypes,
} from "@homzhub/common/src/domain/repositories/interfaces";
import { LocaleConstants } from "@homzhub/common/src/services/Localization/constants";
import { EventType } from "@homzhub/common/src/services/Analytics/EventType";

interface IStateProps {
  isLoading: boolean;
  redirectionDetails: IRedirectionDetails;
}

interface IDispatchProps {
  login: (payload: ILoginPayload) => void;
  loginSuccess: (data: IUserTokens) => void;
}

type libraryProps = NavigationScreenProps<AuthStackParamList, ScreensKeys.OTP> &
  WithTranslation;
type IProps = IDispatchProps & IStateProps & libraryProps;

interface IOtpState {
  error: boolean;
  emailOtp?: string;
  phoneOrEmailOtp?: string;
}

export class Otp extends React.PureComponent<IProps, IOtpState> {
  public state = {
    error: false,
    emailOtp: "",
    phoneOrEmailOtp: "",
  };

  public componentDidMount = async (): Promise<void> => {
    const {
      route: {
        params: { updateProfileCallback },
      },
    } = this.props;

    if (!updateProfileCallback) {
      await this.fetchOtp();
    }
  };

  public render = (): React.ReactNode => {
    const {
      t,
      isLoading,
      navigation: { goBack },
      route: { params },
    } = this.props;
    const title = params?.title ?? t("verifyNumber");
    const otpSentTo = params?.otpSentTo ?? "";
    const countryCode = params?.countryCode ?? "";

    return (
      <Screen
        headerProps={{ type: "secondary", onIconPress: goBack }}
        pageHeaderProps={{
          contentTitle: title,
          contentSubTitle: t("enterOTP"),
          disableDivider: true,
        }}
        isLoading={isLoading}
        backgroundColor={theme.colors.white}
      >
        {this.renderOtpInputSection(
          `${countryCode} ${otpSentTo}`,
          OtpTypes.PhoneOrEmail
        )}
        {params.type === OtpNavTypes.UpdateProfileByEmailPhoneOtp
          ? this.renderOtpInputSection(params?.email || "", OtpTypes.Email)
          : null}
      </Screen>
    );
  };

  private renderOtpInputSection = (
    otpSentTo: string,
    otpType?: OtpTypes
  ): ReactElement => {
    const {
      t,
      route: {
        params: { type },
      },
    } = this.props;
    const { error } = this.state;

    const toggleError = (): void => {
      this.toggleErrorState(false);
    };

    return (
      <>
        <View style={styles.numberContainer}>
          <Text type="small" textType="semiBold">
            {otpSentTo}
          </Text>
          <Icon
            name={icons.noteBook}
            size={16}
            color={theme.colors.active}
            style={styles.icon}
            onPress={this.onIconPress}
            testID="icnEdit"
          />
        </View>
        <OtpInputs
          error={
            type !== OtpNavTypes.UpdateProfileByEmailPhoneOtp && error
              ? t("otpError")
              : undefined
          }
          bubbleOtp={this.handleOtpVerification}
          toggleError={toggleError}
          otpType={otpType}
        />
        <OtpTimer onResentPress={this.fetchOtp} />
      </>
    );
  };

  private onIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private fetchOtp = async (): Promise<void> => {
    const {
      route: {
        params: { otpSentTo, countryCode },
      },
    } = this.props;

    try {
      if (StringUtils.isValidEmail(otpSentTo)) {
        await UserService.fetchEmailOtp(otpSentTo);
        return;
      }

      await UserService.fetchOtp(otpSentTo, countryCode);
    } catch (e) {
      AlertHelper.error({
        message: e.message,
      });
    }
  };

  private verifyOtp = async (otp: string): Promise<void> => {
    const {
      route: {
        params: { otpSentTo, countryCode, type },
      },
    } = this.props;
    console.log("NNNNNNNNNNNNNNNNNNN", otp);
    if (type === OtpNavTypes.Login) {
      this.loginOtp(otp ?? "");
      return;
    }

    if (type === OtpNavTypes.SocialMedia) {
      await this.socialSignUp(otp);
      return;
    }

    try {
      await UserService.verifyOtp(otp, otpSentTo, countryCode);
      if (type === OtpNavTypes.SignUp) {
        await this.signUp();
      }
    } catch (e) {
      this.toggleErrorState(true);
    }
  };

  private signUp = async (): Promise<void> => {
    const {
      login,
      route: {
        params: { userData, onCallback },
      },
    } = this.props;

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
        is_from_signup: true,
        ...(onCallback && { callback: onCallback }),
        handleDynamicLink: this.handleDynamicLink,
      };
      login(loginPayload);
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  private handleDynamicLink = (): void => {
    const { redirectionDetails } = this.props;
    if (
      redirectionDetails.shouldRedirect &&
      redirectionDetails.redirectionLink
    ) {
      NavigationService.handleDynamicLinkNavigation(redirectionDetails).then();
    }
  };

  private socialSignUp = async (otp: string): Promise<void> => {
    const {
      loginSuccess,
      route: {
        params: { socialUserData, otpSentTo, countryCode },
      },
    } = this.props;

    if (!socialUserData || !otpSentTo || !countryCode) {
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
        phone_code: countryCode,
        phone_number: otpSentTo,
      });

      const tokens = {
        refresh_token: data.refreshToken,
        access_token: data.accessToken,
      };
      loginSuccess(tokens);
      await StorageService.set<IUserTokens>(StorageKeys.USER, tokens);

      AnalyticsService.track(EventType.SignupSuccess, trackData);
      // @ts-ignore
      AnalyticsService.setUser(
        ObjectMapper.deserialize(User, socialUserData.user)
      );
    } catch (e) {
      AnalyticsService.track(EventType.SignupFailure, {
        ...trackData,
        error: e.message,
      });
      AlertHelper.error({ message: e.message });
    }
  };

  private loginOtp = (otp: string): void => {
    console.log("NNNNNNNNNNNNNNNNNNN", otp);
    const {
      login,
      route: {
        params: { otpSentTo, countryCode, onCallback },
      },
    } = this.props;

    const loginData: IOtpLoginPayload = {
      action: LoginTypes.OTP,
      payload: {
        phone_code: countryCode,
        phone_number: otpSentTo,
        otp,
      },
    };

    console.log("NNNNNNNNNNNNNNNNNNN", loginData);

    const loginPayload: ILoginPayload = {
      data: loginData,
      callback: onCallback,
      handleDynamicLink: this.handleDynamicLink,
    };
    login(loginPayload);
  };

  private toggleErrorState = (error: boolean): void => {
    this.setState({ error });
  };

  private handleOtpVerification = async (
    otp: string,
    otpType?: OtpTypes
  ): Promise<void> => {
    const {
      route: {
        params: { updateProfileCallback, type },
      },
    } = this.props;

    if (!updateProfileCallback) {
      await this.verifyOtp(otp);
      return;
    }

    if (type === OtpNavTypes.UpdateProfileByEmailPhoneOtp) {
      this.setState(
        () =>
          otpType === OtpTypes.PhoneOrEmail
            ? { phoneOrEmailOtp: otp }
            : { emailOtp: otp },
        () => {
          const { emailOtp, phoneOrEmailOtp } = this.state;
          if (emailOtp && phoneOrEmailOtp) {
            updateProfileCallback(phoneOrEmailOtp, emailOtp);
          }
        }
      );
      return;
    }

    updateProfileCallback(otp);
  };
}

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    isLoading: UserSelector.getLoadingState(state),
    redirectionDetails: CommonSelectors.getRedirectionDetails(
      state
    ) as IRedirectionDetails,
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { login, loginSuccess } = UserActions;
  return bindActionCreators(
    {
      login,
      loginSuccess,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.auth)(Otp));

const styles = StyleSheet.create({
  numberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginStart: 8,
  },
});
