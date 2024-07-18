import React from "react";
import {
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";
import RNOtpVerify from "react-native-otp-verify";
import { PlatformUtils } from "@homzhub/common/src/utils/PlatformUtils";
import { ConfigHelper } from "@homzhub/common/src/utils/ConfigHelper";
import { theme } from "@homzhub/common/src/styles/theme";
import { Label } from "@homzhub/common/src/components/atoms/Text";

export enum OtpTypes {
  PhoneOrEmail = "PhoneOrEmail",
  Email = "Email",
}

interface IProps {
  error?: string;
  otpType?: OtpTypes;
  bubbleOtp: (otp: string, otpType?: OtpTypes) => void;
  toggleError: () => void;
  shouldClear?: boolean;
}

interface IState {
  otp: string[];
  currentFocus: number;
  valuesFlushed: boolean;
}

export class OtpInputs extends React.PureComponent<IProps, IState> {
  private OtpLength: number = ConfigHelper.getOtpLength();
  private isSMSListenerEnabled = PlatformUtils.isAndroid();
  private OtpTextInput: TextInput[] = [];

  public state = {
    otp: Array(this.OtpLength).fill(""),
    currentFocus: 0,
    valuesFlushed: true,
  };

  public componentDidMount = (): void => {
    this.OtpTextInput[0].setNativeProps({ style: styles.active });

    if (this.isSMSListenerEnabled) {
      RNOtpVerify.getOtp().then((isEnabled) => {
        RNOtpVerify.addListener(this.otpHandler);
      });
    }
  };

  public componentDidUpdate(prevProps: IProps, prevState: IState): void {
    const { error, shouldClear } = this.props;
    const { valuesFlushed } = this.state;
    if (!!prevProps.error && !error) {
      this.OtpTextInput[0].setNativeProps({ style: styles.active });
    }
    if (shouldClear && valuesFlushed) {
      this.flushOtpValues();
    }
  }

  public componentWillUnmount = (): void => {
    if (this.isSMSListenerEnabled) {
      RNOtpVerify.removeListener();
    }
  };

  public render = (): React.ReactNode => {
    const { error } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.otpBoxContainer}>{this.renderInputs()}</View>
        {error && (
          <Label type="regular" style={styles.errorText}>
            {error}
          </Label>
        )}
      </View>
    );
  };

  private renderInputs = (): React.ReactNode => {
    const { error } = this.props;
    const { otp, currentFocus } = this.state;
    const inputs = Array(this.OtpLength).fill(0);

    return inputs.map((counter: number, index: number) => {
      const onChangeText = (value: string): void => {
        if (!/\d/.test(value) || PlatformUtils.isIOS()) {
          return;
        }
        this.focusNext(index, value);
      };

      const onKeyPress = (
        event: NativeSyntheticEvent<TextInputKeyPressEventData>
      ): void => {
        const { key } = event.nativeEvent;

        if (key === "Backspace") {
          this.focusPrevious(key, index);
          return;
        }

        if (PlatformUtils.isIOS() && /\d/.test(key)) {
          if (otp[index]) {
            const newIndex = otp.findIndex((item: string) => !item);
            this.focusNext(newIndex, key);
          } else {
            this.focusNext(index, key);
          }
        }
      };

      let style = styles.textInput;
      if (error) {
        style = { ...styles.textInput, ...styles.error };
      }

      return (
        <View
          key={`${index}-otp`}
          pointerEvents={currentFocus === index ? "auto" : "none"}
        >
          <TextInput
            key={`${index}-otp`}
            caretHidden
            textContentType="oneTimeCode"
            value={otp[index]}
            autoFocus={index === 0}
            keyboardType="number-pad"
            maxLength={1}
            style={style}
            onChangeText={onChangeText}
            onKeyPress={onKeyPress}
            testID="otpInput"
            ref={(ref): void => {
              this.OtpTextInput[index] = ref!;
            }}
          />
        </View>
      );
    });
  };

  private focusPrevious = (key: string, index: number): void => {
    const { error, toggleError } = this.props;
    const { otp }: { otp: string[] } = this.state;
    otp[index] = "";

    if (key === "Backspace" && index !== 0) {
      this.setState({ otp: [...otp], currentFocus: index - 1 }, () => {
        this.OtpTextInput[index - 1].focus();
        this.OtpTextInput[index].setNativeProps({ style: styles.textInput });
      });
      return;
    }

    if (error) {
      toggleError();
    }
    this.setState({ otp: [...otp] });
  };

  private focusNext = (index: number, value: string): void => {
    const { bubbleOtp, otpType } = this.props;
    const { otp }: { otp: string[] } = this.state;
    let currentFocus = index;
    otp[index] = value;

    if (index < this.OtpTextInput.length - 1) {
      currentFocus = index + 1;
      this.OtpTextInput[index + 1].focus();
      this.OtpTextInput[index + 1].setNativeProps({ style: styles.active });
    }

    if (index === this.OtpTextInput.length - 1) {
      this.OtpTextInput[index].blur();
      bubbleOtp(otp.join(""), otpType);
    }
    this.setState({ otp: [...otp], currentFocus });
  };

  public flushOtpValues = (): void => {
    this.setState({
      otp: Array(this.OtpLength).fill(""),
      valuesFlushed: false,
      currentFocus: 0,
    });
  };

  private otpHandler = (message: string): void => {
    const regexLiteral = new RegExp(`\\d{${this.OtpLength}}`, "g");
    const otpCode: string[] | null = regexLiteral.exec(message);
    const { bubbleOtp, otpType } = this.props;

    if (!otpCode || (otpCode && otpCode[0].length !== this.OtpLength)) {
      return;
    }

    this.setState({ otp: Array.from(otpCode[0]), currentFocus: 5 });
    this.OtpTextInput.forEach((inputRef, index: number) => {
      inputRef.setNativeProps({ style: styles.active });
      if (index === 5) {
        inputRef.focus();
      }
    });

    bubbleOtp(otpCode[0], otpType);
    Keyboard.dismiss();
  };
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  otpBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 4,
    height: 48,
    width: 48,
    borderColor: theme.colors.disabled,
    color: theme.colors.darkTint1,
  },
  errorText: {
    marginTop: 8,
    color: theme.colors.error,
  },
  active: {
    borderColor: theme.colors.active,
  },
  error: {
    borderColor: theme.colors.error,
  },
});
